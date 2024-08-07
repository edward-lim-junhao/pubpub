import type { Adapter, DatabaseSession, DatabaseUser, Session, User } from "lucia";

import { cache } from "react";
import { cookies } from "next/headers";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { Lucia } from "lucia";

import type { Communities, Members, Users, UsersId } from "db/public";
import type { Sessions, SessionsId } from "db/src/public/Sessions";

import { db } from "~/kysely/database";
import { env } from "~/lib/env/env.mjs";

type UserWithMembersShips = Omit<Users, "passwordHash"> & {
	memberships: (Members & {
		community: Communities;
	})[];
};
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<UserWithMembersShips, "id">;
		DatabaseSessionAttributes: Omit<
			Sessions,
			"id" | "expiresAt" | "userId" | "createdAt" | "updatedAt"
		>;
	}
}

class KyselyAdapter implements Adapter {
	public async deleteSession(sessionId: SessionsId): Promise<void> {
		await db.deleteFrom("sessions").where("id", "=", sessionId).executeTakeFirstOrThrow();
	}

	public async deleteUserSessions(userId: UsersId): Promise<void> {
		await db.deleteFrom("sessions").where("userId", "=", userId).executeTakeFirstOrThrow();
	}

	public async getSessionAndUser(
		sessionId: SessionsId
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
		const session = await db
			.selectFrom("sessions")
			.selectAll()
			.select((eb) => [
				jsonObjectFrom(
					eb
						.selectFrom("users")
						.selectAll()
						.select((eb) => [
							"users.id",
							jsonArrayFrom(
								eb
									.selectFrom("members")
									.selectAll()
									.select((eb) => [
										"members.id",
										jsonObjectFrom(
											eb
												.selectFrom("communities")
												.selectAll()
												.select(["communities.id"])
												.whereRef(
													"communities.id",
													"=",
													"members.communityId"
												)
										)
											.$notNull()
											.as("community"),
									])
									.whereRef("members.userId", "=", "users.id")
							)
								.$notNull()
								.as("memberships"),
						])
						.whereRef("users.id", "=", "sessions.userId")
				).as("user"),
			])
			.where("id", "=", sessionId)
			.executeTakeFirst();

		if (!session) {
			return [null, null];
		}

		const { user: databaseUser, ...databaseSession } = session;

		if (!databaseUser) {
			return [null, null];
		}

		return [
			transformIntoDatabaseSession(databaseSession),
			transformIntoDatabaseUser(databaseUser),
		];
	}

	public async getUserSessions(userId: UsersId): Promise<DatabaseSession[]> {
		const result = await db
			.selectFrom("sessions")
			.selectAll()
			.where("userId", "=", userId)
			.execute();

		return result.map((val) => {
			return transformIntoDatabaseSession(val);
		});
	}

	public async setSession(databaseSession: DatabaseSession): Promise<void> {
		const value = {
			id: databaseSession.id as SessionsId,
			userId: databaseSession.userId as UsersId,
			expiresAt: databaseSession.expiresAt,
			...databaseSession.attributes,
		};

		await db.insertInto("sessions").values(value).execute();
	}

	public async updateSessionExpiration(sessionId: SessionsId, expiresAt: Date): Promise<void> {
		await db
			.updateTable("sessions")
			.set("expiresAt", expiresAt)
			.where("id", "=", sessionId)
			.executeTakeFirstOrThrow();
	}

	public async deleteExpiredSessions(): Promise<void> {
		await db
			.deleteFrom("sessions")
			.where("expiresAt", "<=", new Date())
			.executeTakeFirstOrThrow();
	}
}

function transformIntoDatabaseSession(raw: Sessions): DatabaseSession {
	const { id, userId, expiresAt, ...attributes } = raw;
	return {
		userId,
		id,
		expiresAt,
		attributes,
	};
}

function transformIntoDatabaseUser(raw: UserWithMembersShips): DatabaseUser {
	const { id, ...attributes } = raw;
	return {
		id,
		attributes,
	};
}

const adapter = new KyselyAdapter();

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: env.NODE_ENV === "production",
		},
	},
	getUserAttributes: ({
		email,
		isSuperAdmin,
		firstName,
		lastName,
		slug,
		createdAt,
		updatedAt,
		supabaseId,
		memberships,
		avatar,
		orcid,
	}) => {
		return {
			email,
			isSuperAdmin,
			firstName,
			lastName,
			slug,
			createdAt,
			updatedAt,
			supabaseId,
			memberships,
			avatar,
			orcid,
		};
	},
});

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

		if (!sessionId) {
			return {
				user: null,
				session: null,
			};
		}

		const result = await lucia.validateSession(sessionId);

		// next.js throws when you attempt to set cookie when rendering page
		try {
			// a "fresh" session indicates that the session should be refreshed
			// therefore we set the session cookie again with the updated experation dates
			if (result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}

			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {
			// TODO: handle this?
		}
		return result;
	}
);
