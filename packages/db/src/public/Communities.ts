import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.communities */
export type CommunitiesId = string & { __brand: 'CommunitiesId' };

/** Represents the table public.communities */
export default interface CommunitiesTable {
  id: ColumnType<CommunitiesId, CommunitiesId | undefined, CommunitiesId>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

  name: ColumnType<string, string, string>;

  avatar: ColumnType<string | null, string | null, string | null>;

  slug: ColumnType<string, string, string>;
}

export type Communities = Selectable<CommunitiesTable>;

export type NewCommunities = Insertable<CommunitiesTable>;

export type CommunitiesUpdate = Updateable<CommunitiesTable>;

export const communitiesIdSchema = z.string() as unknown as z.Schema<CommunitiesId>;

export const communitiesSchema = z.object({
  id: communitiesId,
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  avatar: z.string().nullable(),
  slug: z.string(),
}) as unknown as z.Schema<Communities>;

export const communitiesInitializerSchema = z.object({
  id: communitiesId.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string(),
  avatar: z.string().optional().nullable(),
  slug: z.string(),
}) as unknown as z.Schema<NewCommunities>;

export const communitiesMutatorSchema = z.object({
  id: communitiesId.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string().optional(),
  avatar: z.string().optional().nullable(),
  slug: z.string().optional(),
}) as unknown as z.Schema<CommunitiesUpdate>;