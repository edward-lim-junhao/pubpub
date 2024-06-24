// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { pubTypesIdSchema, type PubTypesId } from './PubTypes';
import { communitiesIdSchema, type CommunitiesId } from './Communities';
import { usersIdSchema, type UsersId } from './Users';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.pubs */
export type PubsId = string & { __brand: 'PubsId' };

/** Represents the table public.pubs */
export default interface PubsTable {
  id: ColumnType<PubsId, PubsId | undefined, PubsId>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

  pubTypeId: ColumnType<PubTypesId, PubTypesId, PubTypesId>;

  communityId: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

  valuesBlob: ColumnType<unknown | null, unknown | null, unknown | null>;

  parentId: ColumnType<PubsId | null, PubsId | null, PubsId | null>;

  assigneeId: ColumnType<UsersId | null, UsersId | null, UsersId | null>;
}

export type Pubs = Selectable<PubsTable>;

export type NewPubs = Insertable<PubsTable>;

export type PubsUpdate = Updateable<PubsTable>;

export const pubsIdSchema = z.string() as unknown as z.Schema<PubsId>;

export const pubsSchema = z.object({
  id: pubsIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  pubTypeId: pubTypesIdSchema,
  communityId: communitiesIdSchema,
  valuesBlob: z.unknown().nullable(),
  parentId: pubsIdSchema.nullable(),
  assigneeId: usersIdSchema.nullable(),
}) satisfies z.Schema<Pubs>;

export const pubsInitializerSchema = z.object({
  id: pubsIdSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  pubTypeId: pubTypesIdSchema,
  communityId: communitiesIdSchema,
  valuesBlob: z.unknown().optional().nullable(),
  parentId: pubsIdSchema.optional().nullable(),
  assigneeId: usersIdSchema.optional().nullable(),
}) satisfies z.Schema<NewPubs>;

export const pubsMutatorSchema = z.object({
  id: pubsIdSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  pubTypeId: pubTypesIdSchema.optional(),
  communityId: communitiesIdSchema.optional(),
  valuesBlob: z.unknown().optional().nullable(),
  parentId: pubsIdSchema.optional().nullable(),
  assigneeId: usersIdSchema.optional().nullable(),
}) satisfies z.Schema<PubsUpdate>;
