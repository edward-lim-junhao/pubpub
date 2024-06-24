// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { communitiesIdSchema, type CommunitiesId } from './Communities';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.member_groups */
export type MemberGroupsId = string & { __brand: 'MemberGroupsId' };

/** Represents the table public.member_groups */
export default interface MemberGroupsTable {
  id: ColumnType<MemberGroupsId, MemberGroupsId | undefined, MemberGroupsId>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

  canAdmin: ColumnType<boolean, boolean, boolean>;

  communityId: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;
}

export type MemberGroups = Selectable<MemberGroupsTable>;

export type NewMemberGroups = Insertable<MemberGroupsTable>;

export type MemberGroupsUpdate = Updateable<MemberGroupsTable>;

export const memberGroupsIdSchema = z.string() as unknown as z.Schema<MemberGroupsId>;

export const memberGroupsSchema = z.object({
  id: memberGroupsIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  canAdmin: z.boolean(),
  communityId: communitiesIdSchema,
}) satisfies z.Schema<MemberGroups>;

export const memberGroupsInitializerSchema = z.object({
  id: memberGroupsIdSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  canAdmin: z.boolean(),
  communityId: communitiesIdSchema,
}) satisfies z.Schema<NewMemberGroups>;

export const memberGroupsMutatorSchema = z.object({
  id: memberGroupsIdSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  canAdmin: z.boolean().optional(),
  communityId: communitiesIdSchema.optional(),
}) satisfies z.Schema<MemberGroupsUpdate>;
