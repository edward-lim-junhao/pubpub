// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type PubTypesId } from "./PubTypes";

/** Identifier type for public.forms */
export type FormsId = string & { __brand: "FormsId" };

/** Represents the table public.forms */
export default interface FormsTable {
	id: ColumnType<FormsId, FormsId | undefined, FormsId>;

	name: ColumnType<string, string, string>;

	pubTypeId: ColumnType<PubTypesId, PubTypesId, PubTypesId>;
}

export type Forms = Selectable<FormsTable>;

export type NewForms = Insertable<FormsTable>;

export type FormsUpdate = Updateable<FormsTable>;