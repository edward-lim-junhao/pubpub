import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";
import { z } from "zod";

import type { ElementType } from "./ElementType";
import type { FormsId } from "./Forms";
import type { InputComponent } from "./InputComponent";
import type { PubFieldsId } from "./PubFields";
import type { StagesId } from "./Stages";
import type { StructuralFormElement } from "./StructuralFormElement";
import { elementTypeSchema } from "./ElementType";
import { formsIdSchema } from "./Forms";
import { inputComponentSchema } from "./InputComponent";
import { pubFieldsIdSchema } from "./PubFields";
import { stagesIdSchema } from "./Stages";
import { structuralFormElementSchema } from "./StructuralFormElement";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.form_elements */
export type FormElementsId = string & { __brand: "FormElementsId" };

/** Represents the table public.form_elements */
export interface FormElementsTable {
	id: ColumnType<FormElementsId, FormElementsId | undefined, FormElementsId>;

	type: ColumnType<ElementType, ElementType, ElementType>;

	fieldId: ColumnType<PubFieldsId | null, PubFieldsId | null, PubFieldsId | null>;

	formId: ColumnType<FormsId, FormsId, FormsId>;

	order: ColumnType<number | null, number | null, number | null>;

	label: ColumnType<string | null, string | null, string | null>;

	description: ColumnType<string | null, string | null, string | null>;

	element: ColumnType<
		StructuralFormElement | null,
		StructuralFormElement | null,
		StructuralFormElement | null
	>;

	content: ColumnType<string | null, string | null, string | null>;

	required: ColumnType<boolean | null, boolean | null, boolean | null>;

	stageId: ColumnType<StagesId | null, StagesId | null, StagesId | null>;

	component: ColumnType<InputComponent | null, InputComponent | null, InputComponent | null>;

	help: ColumnType<string | null, string | null, string | null>;
}

export type FormElements = Selectable<FormElementsTable>;

export type NewFormElements = Insertable<FormElementsTable>;

export type FormElementsUpdate = Updateable<FormElementsTable>;

export const formElementsIdSchema = z.string().uuid() as unknown as z.Schema<FormElementsId>;

export const formElementsSchema = z.object({
	id: formElementsIdSchema,
	type: elementTypeSchema,
	fieldId: pubFieldsIdSchema.nullable(),
	formId: formsIdSchema,
	order: z.number().nullable(),
	label: z.string().nullable(),
	description: z.string().nullable(),
	element: structuralFormElementSchema.nullable(),
	content: z.string().nullable(),
	required: z.boolean().nullable(),
	stageId: stagesIdSchema.nullable(),
	component: inputComponentSchema.nullable(),
	help: z.string().nullable(),
});

export const formElementsInitializerSchema = z.object({
	id: formElementsIdSchema.optional(),
	type: elementTypeSchema,
	fieldId: pubFieldsIdSchema.optional().nullable(),
	formId: formsIdSchema,
	order: z.number().optional().nullable(),
	label: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	element: structuralFormElementSchema.optional().nullable(),
	content: z.string().optional().nullable(),
	required: z.boolean().optional().nullable(),
	stageId: stagesIdSchema.optional().nullable(),
	component: inputComponentSchema.optional().nullable(),
	help: z.string().optional().nullable(),
});

export const formElementsMutatorSchema = z.object({
	id: formElementsIdSchema.optional(),
	type: elementTypeSchema.optional(),
	fieldId: pubFieldsIdSchema.optional().nullable(),
	formId: formsIdSchema.optional(),
	order: z.number().optional().nullable(),
	label: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	element: structuralFormElementSchema.optional().nullable(),
	content: z.string().optional().nullable(),
	required: z.boolean().optional().nullable(),
	stageId: stagesIdSchema.optional().nullable(),
	component: inputComponentSchema.optional().nullable(),
	help: z.string().optional().nullable(),
});
