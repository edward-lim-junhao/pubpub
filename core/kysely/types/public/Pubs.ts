// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type CommunitiesId } from "./Communities";
import { type PubTypesId } from "./PubTypes";
import { type UsersId } from "./Users";

/** Identifier type for public.pubs */
export type PubsId = string & { __brand: "PubsId" };

/** Represents the table public.pubs */
export default interface PubsTable {
	id: ColumnType<PubsId, PubsId | undefined, PubsId>;

	created_at: ColumnType<Date, Date | string | undefined, Date | string>;

	updated_at: ColumnType<Date, Date | string | undefined, Date | string>;

	pub_type_id: ColumnType<PubTypesId, PubTypesId, PubTypesId>;

	community_id: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

	valuesBlob: ColumnType<unknown | null, unknown | null, unknown | null>;

	parent_id: ColumnType<PubsId | null, PubsId | null, PubsId | null>;

	assignee_id: ColumnType<UsersId | null, UsersId | null, UsersId | null>;
}

export type Pubs = Selectable<PubsTable>;

export type NewPubs = Insertable<PubsTable>;

export type PubsUpdate = Updateable<PubsTable>;
