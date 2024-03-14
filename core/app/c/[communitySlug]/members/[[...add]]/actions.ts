"use server";

import type { SuggestedUser } from "~/lib/server/members";

import prisma from "~/prisma/db";
import { Community } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { getLoginData } from "~/lib/auth/loginData";
import { getServerSupabase } from "~/lib/supabaseServer";
import { formatSupabaseError } from "~/lib/supabase";
import { generateHash, slugifyString } from "~/lib/string";
import { captureException } from "@sentry/nextjs";
import { TableMember } from "./getMemberTableColumns";
import { cache } from "react";
import { User } from "@supabase/supabase-js";
import { env } from "~/lib/env/env.mjs";

export const revalidateMemberPathsAndTags = (community: Community) => {
	revalidatePath(`/c/${community.slug}/members`);
	revalidateTag(`members_${community.id}`);
	// not in use yet, but should be updated here
	revalidateTag(`users`);
};

const isCommunityAdmin = cache(async (community: Community) => {
	const loginData = await getLoginData();

	if (!loginData?.memberships?.find((m) => m.communityId === community.id)?.canAdmin) {
		return {
			error: "You do not have permission to invite members to this community",
			loginData,
		};
	}

	return { loginData, error: null };
});

/**
 * Add someone as a user to supabase and send them an invite by email
 *
 * By default will reinvite the user if they already exist in supabase
 * by deleting them and trying again
 */
const addSupabaseUser = async ({
	email,
	firstName,
	lastName,
	community,
	canAdmin,
	force = true,
}: {
	email: string;
	firstName: string;
	lastName?: string | null;
	community: Community;
	canAdmin?: boolean;
	/**
	 * If true, the user will be reinvited even if they already exist in supabase
	 * by deleting them and trying again
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

	const { error, data } = await client.auth.admin.inviteUserByEmail(email, {
		redirectTo: `${env.NEXT_PUBLIC_PUBPUB_URL}/reset`,
		data: {
			firstName,
			lastName,
			communityId: community.id,
			communitySlug: community.slug,
			communityName: community.name,
			canAdmin,
		},
	});

	if (!error) {
		return { user: data.user, error: null };
	}

	// let's just give up
	if (!force) {
		captureException(error);
		return { user: null, error: `Failed to invite member.\n ${formatSupabaseError(error)}` };
	}

	// 422 = email already exists in supabase
	if (error.status !== 422) {
		captureException(error);
		return { user: null, error: `Failed to invite member.\n ${formatSupabaseError(error)}` };
	}

	// the user already exists in supabase, so we will delete them and try again
	const { data: supabaseUserData, error: getEmailError } = await client.auth.admin.getUserByEmail(
		email
	);

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
		canAdmin,
		force: false,
	});
};

/**
 * Adds a member to a community.
 *
 * First checks if the user is already a member of the community.
 * If not, creates a new member in the db and revalidates the member list.
 *
 * It will then double check to see if the user exists in supabase. If not, it will send an invite to do so
 *
 * @param user - The user to add as a member.
 * @param canAdmin - Optional. Specifies whether the user has admin privileges in the community.
 * @param community - The community to add the member to.
 * @returns A Promise that resolves to the newly created member object, or an error object if an error occurs.
 */
export const addMember = async ({
	user,
	canAdmin,
	community,
}: {
	user: SuggestedUser;
	canAdmin?: boolean;
	community: Community;
}) => {
	const { error: adminError } = await isCommunityAdmin(community);
	if (adminError) {
		return { error: adminError };
	}

	try {
		const existingMember = await prisma.member.findFirst({
			where: {
				userId: user.id,
				communityId: community.id,
			},
		});

		if (existingMember) {
			return { error: "User is already a member of this community" };
		}

		const member = await prisma.member.create({
			data: {
				communityId: community.id,
				userId: user.id,
				canAdmin: Boolean(canAdmin),
			},
		});

		revalidateMemberPathsAndTags(community);

		if (user.supabaseId) {
			return { member };
		}

		// the user exists in our DB, but not in supabase, or is not linked to a supabase user
		// most likely they were invited as an evaluator before by the evaluation integration
		const { error: supabaseInviteError } = await addSupabaseUser({
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			community,
			canAdmin,
			force: true,
		});

		if (supabaseInviteError) {
			return { error: supabaseInviteError };
		}

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				supabaseId: user.supabaseId,
			},
		});

		return { member };
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Create a new user and add them as a member to a community
 * Will also add them as a user to supabase
 */
export const createUserWithMembership = async ({
	firstName,
	lastName,
	email,
	community,
	canAdmin,
}: {
	firstName: string;
	lastName?: string | null;
	email: string;
	community: Community;
	canAdmin: boolean;
}) => {
	const { error: adminError } = await isCommunityAdmin(community);
	if (adminError) {
		return { error: adminError };
	}

	const user = await prisma.user.create({
		data: {
			email,
			firstName,
			lastName,
			slug: `${slugifyString(firstName)}${
				lastName ? `-${slugifyString(lastName)}` : ""
			}-${generateHash(4, "0123456789")}`,
			memberships: {
				create: {
					communityId: community.id,
					canAdmin,
				},
			},
		},
	});

	const { error: supabaseError, user: supabaseUser } = await addSupabaseUser({
		email,
		firstName,
		lastName,
		community,
		canAdmin,
	});

	if (supabaseError !== null) {
		return { error: supabaseError };
	}

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			supabaseId: supabaseUser.id,
		},
	});

	revalidateMemberPathsAndTags(community);

	return { user };
};

export const removeMember = async ({
	member,
	community,
}: {
	member: TableMember;
	community: Community;
}) => {
	try {
		const { loginData, error: adminError } = await isCommunityAdmin(community);

		if (adminError) {
			return { error: adminError };
		}

		if (loginData?.memberships.find((m) => m.id === member.id)) {
			return { error: "You cannot remove yourself from the community" };
		}

		const deleted = await prisma.member.delete({
			where: {
				id: member.id,
			},
		});

		if (!deleted) {
			return { error: "Failed to remove member" };
		}

		revalidateMemberPathsAndTags(community);
		return { success: true };
	} catch (error) {
		return { error: error.message };
	}
};
