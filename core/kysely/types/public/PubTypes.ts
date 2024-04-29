// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type CommunitiesId } from "./Communities";

/** Identifier type for public.pub_types */
export type PubTypesId = string & { __brand: "PubTypesId" };

/** Represents the table public.pub_types */
export default interface PubTypesTable {
	id: ColumnType<PubTypesId, PubTypesId | undefined, PubTypesId>;

	created_at: ColumnType<Date, Date | string | undefined, Date | string>;

	updated_at: ColumnType<Date, Date | string | undefined, Date | string>;

	community_id: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

	name: ColumnType<string, string, string>;

	description: ColumnType<string | null, string | null, string | null>;
}

export type PubTypes = Selectable<PubTypesTable>;

export type NewPubTypes = Insertable<PubTypesTable>;

export type PubTypesUpdate = Updateable<PubTypesTable>;