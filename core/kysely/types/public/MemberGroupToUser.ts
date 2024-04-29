// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type MemberGroupsId } from "./MemberGroups";
import { type UsersId } from "./Users";

/** Represents the table public._MemberGroupToUser */
export default interface MemberGroupToUserTable {
	A: ColumnType<MemberGroupsId, MemberGroupsId, MemberGroupsId>;

	B: ColumnType<UsersId, UsersId, UsersId>;
}

export type MemberGroupToUser = Selectable<MemberGroupToUserTable>;

export type NewMemberGroupToUser = Insertable<MemberGroupToUserTable>;

export type MemberGroupToUserUpdate = Updateable<MemberGroupToUserTable>;