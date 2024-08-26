"use server";

import type { Community } from "@prisma/client";
import type { User } from "@supabase/supabase-js";

import { cache } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { captureException } from "@sentry/nextjs";

import type { Members, MembersId, UsersId } from "db/public";
import { MemberRole } from "db/public";

import type { TableMember } from "./getMemberTableColumns";
import type { SuggestedUser } from "~/lib/server/members";
import { getLoginData } from "~/lib/auth/loginData";
import { isCommunityAdmin as isAdminOfCommunity } from "~/lib/auth/roles";
import { env } from "~/lib/env/env.mjs";
import { revalidateTagsForCommunity } from "~/lib/server/cache/revalidate";
import { findCommunityBySlug } from "~/lib/server/community";
import { defineServerAction } from "~/lib/server/defineServerAction";
import {
	inviteMember as dbAddMember,
	getMember as dbGetMember,
	removeMember as dbRemoveMember,
} from "~/lib/server/member";
import { addUser, getUser } from "~/lib/server/user";
import { ClientException, ClientExceptionOptions } from "~/lib/serverActions";
import { generateHash, slugifyString } from "~/lib/string";
import { formatSupabaseError } from "~/lib/supabase";
import { getServerSupabase } from "~/lib/supabaseServer";
import { memberInviteFormSchema } from "./memberInviteFormSchema";

export const revalidateMemberPathsAndTags = defineServerAction(
	async function revalidateMemberPathsAndTags(community: Community) {
		revalidatePath(`/c/${community.slug}/members`);
		revalidateTagsForCommunity(["members", "users"]);
	}
);

const isCommunityAdmin = cache(async () => {
	const [{ user }, community] = await Promise.all([getLoginData(), findCommunityBySlug()]);

	if (!user) {
		return {
			error: "You are not logged in",
		};
	}

	if (!community) {
		return {
			error: "Community not found",
		};
	}

	if (!isAdminOfCommunity(user, community)) {
		return {
			error: "You do not have permission to invite members to this community",
		};
	}

	return { user, error: null, community };
});

/**
 * Create a user in supabase.
 * If the user is not a contributor, also sends them an invite by email
 */
const createOrInviteSupabaseUser = async ({
	email,
	firstName,
	lastName,
	community,
	role,
	isSuperAdmin,
}: {
	email: string;
	firstName: string;
	lastName?: string | null;
	community: Community;
	role?: MemberRole;
	isSuperAdmin?: boolean;
}) => {
	const client = getServerSupabase();

	if (role === MemberRole.contributor) {
		const data = await client.auth.admin.createUser({
			email,
			user_metadata: {
				firstName,
				lastName,
				communityId: community.id,
				communitySlug: community.slug,
				communityName: community.name,
				role,
				isSuperAdmin,
			},
		});
		return data;
	}

	const data = await client.auth.admin.inviteUserByEmail(email, {
		redirectTo: `${env.NEXT_PUBLIC_PUBPUB_URL}/reset`,
		data: {
			firstName,
			lastName,
			communityId: community.id,
			communitySlug: community.slug,
			communityName: community.name,
			role,
			isSuperAdmin,
		},
	});

	return data;
};

/**
 * Add someone as a user to supabase and send them an invite by email
 *
 * By default will reinvite the user if they already exist in supabase by deleting them and trying
 * again
 */
const addSupabaseUser = async ({
	email,
	firstName,
	lastName,
	community,
	role,
	force = true,
	isSuperAdmin,
}: {
	email: string;
	firstName: string;
	lastName?: string | null;
	community: Community;
	role?: MemberRole;
	isSuperAdmin?: boolean;
	/**
	 * If true, the user will be reinvited even if they already exist in supabase by deleting them
	 * and trying again
	 *
	 * @default true
	 */
	force?: boolean;
}): Promise<
	| {
			user: User;
			error: null;
	  }
	| {
			user: null;
			error: string;
	  }
> => {
	const client = getServerSupabase();

	const { error, data } = await createOrInviteSupabaseUser({
		email,
		firstName,
		lastName,
		community,
		role,
		isSuperAdmin,
	});

	if (!error) {
		return { user: data.user, error: null };
	}

	// let's just give up
	if (!force) {
		captureException(error);
		return {
			user: null,
			error: `Failed to invite member.\n ${formatSupabaseError(error)}`,
		};
	}

	// 422 = email already exists in supabase
	if (error.status !== 422) {
		captureException(error);
		return {
			user: null,
			error: `Failed to invite member.\n ${formatSupabaseError(error)}`,
		};
	}

	// the user already exists in supabase, so we will delete them and try again
	const { data: supabaseUserData, error: getEmailError } =
		await client.auth.admin.getUserByEmail(email);

	if (getEmailError) {
		captureException(getEmailError);
		return { user: null, error: `Failed to invite member.` };
	}

	const { error: deleteError } = await client.auth.admin.deleteUser(supabaseUserData.user.id);

	if (deleteError) {
		captureException(deleteError);
		return { user: null, error: `Failed to invite member.` };
	}

	return addSupabaseUser({
		email,
		firstName,
		lastName,
		community,
		role,
		force: false,
		isSuperAdmin,
	});
};

/**
 * Adds a member to a community.
 *
 * First checks if the user is already a member of the community. If not, creates a new member in
 * the db and revalidates the member list.
 *
 * It will then double check to see if the user exists in supabase. If not, it will send an invite
 * to do so
 *
 * @param user - The user to add as a member.
 * @param role - Optional. Specifies the role of the user in the community.
 * @param community - The community to add the member to.
 * @returns A Promise that resolves to the newly created member object, or an error object if an
 *   error occurs.
 */
export const addMember = defineServerAction(async function addMember({
	user,
	role,
}: {
	user: SuggestedUser;
	role?: MemberRole;
}) {
	const result = await isCommunityAdmin();
	if (result.error !== null) {
		return {
			title: "Failed to add member",
			error: "You do not have permission to invite members to this community",
		};
	}

	try {
		const existingMember = await dbGetMember({
			userId: user.id as UsersId,
			communityId: result.community.id,
		}).executeTakeFirst();

		if (existingMember) {
			return {
				title: "Failed to add member",
				error: "User is already a member of this community",
			};
		}

		const member = await dbAddMember({
			userId: user.id as UsersId,
			communityId: result.community.id,
			role,
		}).executeTakeFirst();

		revalidateMemberPathsAndTags(result.community);

		return { member };
		// if (user.supabaseId) {
		// 	return { member };
		// }

		// // No longer invite user to supabase
		// const { error: supabaseInviteError } = await addSupabaseUser({
		// 	email: user.email,
		// 	firstName: user.firstName,
		// 	lastName: user.lastName,
		// 	community,
		// 	role,
		// 	force: true,
		// });

		// if (supabaseInviteError) {
		// 	return {
		// 		title: "Failed to add member",
		// 		error: "We encounted a problem with our authentication provider.",
		// 	};
		// }

		// await prisma.user.update({
		// 	where: {
		// 		id: user.id,
		// 	},
		// 	data: {
		// 		supabaseId: user.supabaseId,
		// 	},
		// });

		// return { member };
	} catch (error) {
		return {
			title: "Failed to add member",
			error: "An unexpected error occurred",
			cause: error,
		};
	}
});

/**
 * Create a new user and add them as a member to a community
 *
 * Will also add them as a user to
 * supabase
 */
export const createUserWithMembership = defineServerAction(async function createUserWithMembership({
	...data
}: {
	firstName: string;
	lastName?: string | null;
	email: string;
	role?: MemberRole;
	isSuperAdmin?: boolean;
}) {
	const parsed = memberInviteFormSchema
		.required({ firstName: true, lastName: true })
		.safeParse(data);

	if (!parsed.success) {
		return {
			title: "Form values are invalid",
			error: parsed.error.message,
		};
	}

	const { firstName, lastName, email, role, isSuperAdmin } = parsed.data;

	try {
		const { error: adminError, user, community } = await isCommunityAdmin();
		if (!user?.isSuperAdmin && isSuperAdmin) {
			return {
				title: "Failed to add member",
				error: "You cannot add members as super admins",
			};
		}

		if (adminError !== null) {
			return {
				title: "Failed to add member",
				error: "You do not have permission to invite members to this community",
			};
		}

		const newUser = await addUser({
			email,
			firstName,
			lastName,
			slug: `${slugifyString(firstName)}${
				lastName ? `-${slugifyString(lastName)}` : ""
			}-${generateHash(4, "0123456789")}`,
			isSuperAdmin: isSuperAdmin === true,
		}).executeTakeFirstOrThrow();

		const member = await dbAddMember({
			userId: newUser.id,
			communityId: community.id,
			role,
		}).executeTakeFirst();

		// const { error: supabaseError, user: supabaseUser } = await addSupabaseUser({
		// 	email,
		// 	firstName,
		// 	lastName,
		// 	community,
		// 	role,
		// 	isSuperAdmin: isSuperAdmin === true,
		// });

		// if (supabaseError !== null) {
		// 	return {
		// 		title: "Failed to add member",
		// 		error: "We encounted a problem with our authentication provider",
		// 	};
		// }

		// await prisma.user.update({
		// 	where: {
		// 		id: newUser.id,
		// 	},
		// 	data: {
		// 		supabaseId: supabaseUser.id,
		// 	},
		// });

		revalidateMemberPathsAndTags(community);

		return { ...user, memberships: [member] };
	} catch (error) {
		return {
			title: "Failed to add member",
			error: "An unexpected error occurred",
			cause: error,
		};
	}
});

export const removeMember = defineServerAction(async function removeMember({
	member,
}: {
	member: TableMember;
}) {
	try {
		const { user, error: adminError, community } = await isCommunityAdmin();

		if (adminError !== null) {
			return {
				title: "Failed to remove member",
				error: adminError,
			};
		}

		if (user?.memberships.find((m) => m.id === member.id)) {
			return {
				title: "Failed to remove member",
				error: "You cannot remove yourself from the community",
			};
		}

		const removedMember = await dbRemoveMember(member.id as MembersId).executeTakeFirst();

		if (!removedMember) {
			return {
				title: "Failed to remove member",
				error: "An unexpected error occurred",
			};
		}

		revalidateMemberPathsAndTags(community);
		return { success: true };
	} catch (error) {
		return {
			title: "Failed to remove member",
			error: "An unexpected error occurred",
			cause: error,
		};
	}
});
