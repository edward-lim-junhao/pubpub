// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type FormsId } from "./Forms";
import { type PubFieldsId } from "./PubFields";

/** Identifier type for public.form_inputs */
export type FormInputsId = string & { __brand: "FormInputsId" };

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