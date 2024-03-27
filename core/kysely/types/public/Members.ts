// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type CommunitiesId } from "./Communities";
import { type UsersId } from "./Users";
import { type ColumnType, type Selectable, type Insertable, type Updateable } from "kysely";

/** Identifier type for public.members */
export type MembersId = string & { __brand: "MembersId" };

/** Represents the table public.members */
export default interface MembersTable {
	id: ColumnType<MembersId, MembersId, MembersId>;

	created_at: ColumnType<Date, Date | string | undefined, Date | string>;

	updated_at: ColumnType<Date, Date | string | undefined, Date | string>;

	canAdmin: ColumnType<boolean, boolean, boolean>;

	community_id: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

	user_id: ColumnType<UsersId, UsersId, UsersId>;
}

export type Members = Selectable<MembersTable>;

export type NewMembers = Insertable<MembersTable>;

export type MembersUpdate = Updateable<MembersTable>;