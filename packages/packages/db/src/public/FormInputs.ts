// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { pubFieldsIdSchema, type PubFieldsId } from './PubFields';
import { formsIdSchema, type FormsId } from './Forms';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.form_inputs */
export type FormInputsId = string & { __brand: 'FormInputsId' };

/** Represents the table public.form_inputs */
export default interface FormInputsTable {
  id: ColumnType<FormInputsId, FormInputsId | undefined, FormInputsId>;

  fieldId: ColumnType<PubFieldsId, PubFieldsId, PubFieldsId>;

  formId: ColumnType<FormsId, FormsId, FormsId>;

  order: ColumnType<string, string, string>;

  label: ColumnType<string, string, string>;

  required: ColumnType<boolean, boolean, boolean>;

  isSubmit: ColumnType<boolean, boolean, boolean>;
}

export type FormInputs = Selectable<FormInputsTable>;

export type NewFormInputs = Insertable<FormInputsTable>;

export type FormInputsUpdate = Updateable<FormInputsTable>;

export const formInputsIdSchema = z.string().uuid() as unknown as z.Schema<FormInputsId>;

export const formInputsSchema = z.object({
  id: formInputsIdSchema,
  fieldId: pubFieldsIdSchema,
  formId: formsIdSchema,
  order: z.string(),
  label: z.string(),
  required: z.boolean(),
  isSubmit: z.boolean(),
}) as z.ZodObject<{[K in keyof FormInputs]: z.Schema<FormInputs[K]>}>;

export const formInputsInitializerSchema = z.object({
  id: formInputsIdSchema.optional(),
  fieldId: pubFieldsIdSchema,
  formId: formsIdSchema,
  order: z.string(),
  label: z.string(),
  required: z.boolean(),
  isSubmit: z.boolean(),
}) as z.ZodObject<{[K in keyof NewFormInputs]: z.Schema<NewFormInputs[K]>}>;

export const formInputsMutatorSchema = z.object({
  id: formInputsIdSchema.optional(),
  fieldId: pubFieldsIdSchema.optional(),
  formId: formsIdSchema.optional(),
  order: z.string().optional(),
  label: z.string().optional(),
  required: z.boolean().optional(),
  isSubmit: z.boolean().optional(),
}) as z.ZodObject<{[K in keyof FormInputsUpdate]: z.Schema<FormInputsUpdate[K]>}>;