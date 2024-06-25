// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type IntegrationInstancesId } from "./IntegrationInstances";
import { type PubsId } from "./Pubs";

/** Represents the table public._IntegrationInstanceToPub */
export default interface IntegrationInstanceToPubTable {
	A: ColumnType<IntegrationInstancesId, IntegrationInstancesId, IntegrationInstancesId>;

	B: ColumnType<PubsId, PubsId, PubsId>;
}

export type IntegrationInstanceToPub = Selectable<IntegrationInstanceToPubTable>;

export type NewIntegrationInstanceToPub = Insertable<IntegrationInstanceToPubTable>;

export type IntegrationInstanceToPubUpdate = Updateable<IntegrationInstanceToPubTable>;