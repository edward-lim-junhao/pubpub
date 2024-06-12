import { communitiesId, type CommunitiesId } from './Communities';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.pub_types */
export type PubTypesId = string & { __brand: 'PubTypesId' };

/** Represents the table public.pub_types */
export default interface PubTypesTable {
  id: ColumnType<PubTypesId, PubTypesId | undefined, PubTypesId>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

  communityId: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

  name: ColumnType<string, string, string>;

  description: ColumnType<string | null, string | null, string | null>;
}

export type PubTypes = Selectable<PubTypesTable>;

export type NewPubTypes = Insertable<PubTypesTable>;

export type PubTypesUpdate = Updateable<PubTypesTable>;

export const pubTypesIdSchema = z.string() as unknown as z.Schema<PubTypesId>;

export const pubTypesSchema = z.object({
  id: pubTypesId,
  createdAt: z.date(),
  updatedAt: z.date(),
  communityId: communitiesId,
  name: z.string(),
  description: z.string().nullable(),
}) as unknown as z.Schema<PubTypes>;

export const pubTypesInitializerSchema = z.object({
  id: pubTypesId.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  communityId: communitiesId,
  name: z.string(),
  description: z.string().optional().nullable(),
}) as unknown as z.Schema<NewPubTypes>;

export const pubTypesMutatorSchema = z.object({
  id: pubTypesId.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  communityId: communitiesId.optional(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
}) as unknown as z.Schema<PubTypesUpdate>;