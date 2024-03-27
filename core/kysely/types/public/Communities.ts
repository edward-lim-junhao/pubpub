// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Selectable, type Insertable, type Updateable } from "kysely";

/** Identifier type for public.communities */
export type CommunitiesId = string & { __brand: "CommunitiesId" };

/** Represents the table public.communities */
export default interface CommunitiesTable {
	id: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

	created_at: ColumnType<Date, Date | string | undefined, Date | string>;

	updated_at: ColumnType<Date, Date | string | undefined, Date | string>;

	name: ColumnType<string, string, string>;

	avatar: ColumnType<string | null, string | null, string | null>;

	slug: ColumnType<string, string, string>;
}

export type Communities = Selectable<CommunitiesTable>;

export type NewCommunities = Insertable<CommunitiesTable>;

export type CommunitiesUpdate = Updateable<CommunitiesTable>;
