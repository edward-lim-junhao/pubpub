// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type PubsId } from "./Pubs";
import { type StagesId } from "./Stages";
import { type UsersId } from "./Users";

/** Identifier type for public.action_claim */
export type ActionClaimId = string & { __brand: "ActionClaimId" };

/** Represents the table public.action_claim */
export default interface ActionClaimTable {
	id: ColumnType<ActionClaimId, ActionClaimId | undefined, ActionClaimId>;

	stage_id: ColumnType<StagesId, StagesId, StagesId>;

	pub_id: ColumnType<PubsId, PubsId, PubsId>;

	user_id: ColumnType<UsersId, UsersId, UsersId>;

	releasedAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

	created_at: ColumnType<Date, Date | string | undefined, Date | string>;

	updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type ActionClaim = Selectable<ActionClaimTable>;

export type NewActionClaim = Insertable<ActionClaimTable>;

export type ActionClaimUpdate = Updateable<ActionClaimTable>;
