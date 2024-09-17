import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { z } from "zod";

import type { MemberGroupsId } from "./MemberGroups";
import type { UsersId } from "./Users";
import { memberGroupsIdSchema } from "./MemberGroups";
import { usersIdSchema } from "./Users";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Represents the table public._MemberGroupToUser */
export interface MemberGroupToUserTable {
	A: ColumnType<MemberGroupsId, MemberGroupsId, MemberGroupsId>;

	B: ColumnType<UsersId, UsersId, UsersId>;
}

export type MemberGroupToUser = Selectable<MemberGroupToUserTable>;

export type NewMemberGroupToUser = Insertable<MemberGroupToUserTable>;

export type MemberGroupToUserUpdate = Updateable<MemberGroupToUserTable>;

export const memberGroupToUserSchema = z.object({
	A: memberGroupsIdSchema,
	B: usersIdSchema,
});

export const memberGroupToUserInitializerSchema = z.object({
	A: memberGroupsIdSchema,
	B: usersIdSchema,
});

export const memberGroupToUserMutatorSchema = z.object({
	A: memberGroupsIdSchema.optional(),
	B: usersIdSchema.optional(),
});
