import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.PubFieldSchema */
export type PubFieldSchemaId = string & { __brand: 'PubFieldSchemaId' };

/** Represents the table public.PubFieldSchema */
export default interface PubFieldSchemaTable {
  id: ColumnType<PubFieldSchemaId, PubFieldSchemaId | undefined, PubFieldSchemaId>;

  namespace: ColumnType<string, string, string>;

  name: ColumnType<string, string, string>;

  schema: ColumnType<unknown, unknown, unknown>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type PubFieldSchema = Selectable<PubFieldSchemaTable>;

export type NewPubFieldSchema = Insertable<PubFieldSchemaTable>;

export type PubFieldSchemaUpdate = Updateable<PubFieldSchemaTable>;

export const pubFieldSchemaIdSchema = z.string() as unknown as z.Schema<PubFieldSchemaId>;

export const pubFieldSchemaSchema = z.object({
  id: pubFieldSchemaId,
  namespace: z.string(),
  name: z.string(),
  schema: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) as unknown as z.Schema<PubFieldSchema>;

export const pubFieldSchemaInitializerSchema = z.object({
  id: pubFieldSchemaId.optional(),
  namespace: z.string(),
  name: z.string(),
  schema: z.unknown(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}) as unknown as z.Schema<NewPubFieldSchema>;

export const pubFieldSchemaMutatorSchema = z.object({
  id: pubFieldSchemaId.optional(),
  namespace: z.string().optional(),
  name: z.string().optional(),
  schema: z.unknown().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}) as unknown as z.Schema<PubFieldSchemaUpdate>;