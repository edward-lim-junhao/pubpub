import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { z } from "zod";

import type { MemberGroupsId } from "./MemberGroups";
import type { MemberRole } from "./MemberRole";
import type { MembersId } from "./Members";
import { memberGroupsIdSchema } from "./MemberGroups";
import { memberRoleSchema } from "./MemberRole";
import { membersIdSchema } from "./Members";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.permissions */
export type PermissionsId = string & { __brand: "PermissionsId" };

/** Represents the table public.permissions */
export interface PermissionsTable {
	id: ColumnType<PermissionsId, PermissionsId | undefined, PermissionsId>;

	memberId: ColumnType<MembersId | null, MembersId | null, MembersId | null>;

	memberGroupId: ColumnType<MemberGroupsId | null, MemberGroupsId | null, MemberGroupsId | null>;

	createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

	updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

	role: ColumnType<MemberRole | null, MemberRole | null, MemberRole | null>;
}

export type Permissions = Selectable<PermissionsTable>;

export type NewPermissions = Insertable<PermissionsTable>;

export type PermissionsUpdate = Updateable<PermissionsTable>;

export const permissionsIdSchema = z.string().uuid() as unknown as z.Schema<PermissionsId>;

export const permissionsSchema = z.object({
	id: permissionsIdSchema,
	memberId: membersIdSchema.nullable(),
	memberGroupId: memberGroupsIdSchema.nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	role: memberRoleSchema.nullable(),
});

export const permissionsInitializerSchema = z.object({
	id: permissionsIdSchema.optional(),
	memberId: membersIdSchema.optional().nullable(),
	memberGroupId: memberGroupsIdSchema.optional().nullable(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	role: memberRoleSchema.optional().nullable(),
});

export const permissionsMutatorSchema = z.object({
	id: permissionsIdSchema.optional(),
	memberId: membersIdSchema.optional().nullable(),
	memberGroupId: memberGroupsIdSchema.optional().nullable(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	role: memberRoleSchema.optional().nullable(),
});
