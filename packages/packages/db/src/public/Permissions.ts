// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { membersIdSchema, type MembersId } from './Members';
import { memberGroupsIdSchema, type MemberGroupsId } from './MemberGroups';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.permissions */
export type PermissionsId = string & { __brand: 'PermissionsId' };

/** Represents the table public.permissions */
export default interface PermissionsTable {
  id: ColumnType<PermissionsId, PermissionsId | undefined, PermissionsId>;

  memberId: ColumnType<MembersId | null, MembersId | null, MembersId | null>;

  memberGroupId: ColumnType<MemberGroupsId | null, MemberGroupsId | null, MemberGroupsId | null>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
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
}) as z.ZodObject<{[K in keyof Permissions]: z.Schema<Permissions[K]>}>;

export const permissionsInitializerSchema = z.object({
  id: permissionsIdSchema.optional(),
  memberId: membersIdSchema.optional().nullable(),
  memberGroupId: memberGroupsIdSchema.optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}) as z.ZodObject<{[K in keyof NewPermissions]: z.Schema<NewPermissions[K]>}>;

export const permissionsMutatorSchema = z.object({
  id: permissionsIdSchema.optional(),
  memberId: membersIdSchema.optional().nullable(),
  memberGroupId: memberGroupsIdSchema.optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}) as z.ZodObject<{[K in keyof PermissionsUpdate]: z.Schema<PermissionsUpdate[K]>}>;