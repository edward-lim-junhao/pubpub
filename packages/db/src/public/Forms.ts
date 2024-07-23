import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";
import { z } from "zod";

import type { CommunitiesId } from "./Communities";
import type { FormAccessType } from "./FormAccessType";
import type { PubTypesId } from "./PubTypes";
import { communitiesIdSchema } from "./Communities";
import { formAccessTypeSchema } from "./FormAccessType";
import { pubTypesIdSchema } from "./PubTypes";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.forms */
export type FormsId = string & { __brand: "FormsId" };

/** Represents the table public.forms */
export interface FormsTable {
	id: ColumnType<FormsId, FormsId | undefined, FormsId>;

	name: ColumnType<string, string, string>;

	pubTypeId: ColumnType<PubTypesId, PubTypesId, PubTypesId>;

	isArchived: ColumnType<boolean, boolean | undefined, boolean>;

	communityId: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

	slug: ColumnType<string, string, string>;

	access: ColumnType<FormAccessType, FormAccessType | undefined, FormAccessType>;
}

export type Forms = Selectable<FormsTable>;

export type NewForms = Insertable<FormsTable>;

export type FormsUpdate = Updateable<FormsTable>;

export const formsIdSchema = z.string().uuid() as unknown as z.Schema<FormsId>;

export const formsSchema = z.object({
	id: formsIdSchema,
	name: z.string(),
	pubTypeId: pubTypesIdSchema,
	isArchived: z.boolean(),
	communityId: communitiesIdSchema,
	slug: z.string(),
	access: formAccessTypeSchema,
});

export const formsInitializerSchema = z.object({
	id: formsIdSchema.optional(),
	name: z.string(),
	pubTypeId: pubTypesIdSchema,
	isArchived: z.boolean().optional(),
	communityId: communitiesIdSchema,
	slug: z.string(),
	access: formAccessTypeSchema.optional(),
});

export const formsMutatorSchema = z.object({
	id: formsIdSchema.optional(),
	name: z.string().optional(),
	pubTypeId: pubTypesIdSchema.optional(),
	isArchived: z.boolean().optional(),
	communityId: communitiesIdSchema.optional(),
	slug: z.string().optional(),
	access: formAccessTypeSchema.optional(),
});