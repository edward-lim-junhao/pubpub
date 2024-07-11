// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { pubTypesIdSchema, type PubTypesId } from './PubTypes';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.forms */
export type FormsId = string & { __brand: 'FormsId' };

/** Represents the table public.forms */
export default interface FormsTable {
  id: ColumnType<FormsId, FormsId | undefined, FormsId>;

  name: ColumnType<string, string, string>;

  pubTypeId: ColumnType<PubTypesId, PubTypesId, PubTypesId>;
}

export type Forms = Selectable<FormsTable>;

export type NewForms = Insertable<FormsTable>;

export type FormsUpdate = Updateable<FormsTable>;

export const formsIdSchema = z.string().uuid() as unknown as z.Schema<FormsId>;

export const formsSchema = z.object({
  id: formsIdSchema,
  name: z.string(),
  pubTypeId: pubTypesIdSchema,
}) as z.ZodObject<{[K in keyof Forms]: z.Schema<Forms[K]>}>;

export const formsInitializerSchema = z.object({
  id: formsIdSchema.optional(),
  name: z.string(),
  pubTypeId: pubTypesIdSchema,
}) as z.ZodObject<{[K in keyof NewForms]: z.Schema<NewForms[K]>}>;

export const formsMutatorSchema = z.object({
  id: formsIdSchema.optional(),
  name: z.string().optional(),
  pubTypeId: pubTypesIdSchema.optional(),
}) as z.ZodObject<{[K in keyof FormsUpdate]: z.Schema<FormsUpdate[K]>}>;