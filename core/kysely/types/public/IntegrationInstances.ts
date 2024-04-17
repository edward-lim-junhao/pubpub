// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type CommunitiesId } from "./Communities";
import { type IntegrationsId } from "./Integrations";
import { type StagesId } from "./Stages";

/** Identifier type for public.integration_instances */
export type IntegrationInstancesId = string & { __brand: "IntegrationInstancesId" };

/** Represents the table public.integration_instances */
export default interface IntegrationInstancesTable {
	id: ColumnType<
		IntegrationInstancesId,
		IntegrationInstancesId | undefined,
		IntegrationInstancesId
	>;

	name: ColumnType<string, string, string>;

	integration_id: ColumnType<IntegrationsId, IntegrationsId, IntegrationsId>;

	created_at: ColumnType<Date, Date | string | undefined, Date | string>;

	updated_at: ColumnType<Date, Date | string | undefined, Date | string>;

	community_id: ColumnType<CommunitiesId, CommunitiesId, CommunitiesId>;

	stage_id: ColumnType<StagesId | null, StagesId | null, StagesId | null>;

	config: ColumnType<unknown | null, unknown | null, unknown | null>;
}

export type IntegrationInstances = Selectable<IntegrationInstancesTable>;

export type NewIntegrationInstances = Insertable<IntegrationInstancesTable>;

export type IntegrationInstancesUpdate = Updateable<IntegrationInstancesTable>;
