// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type default as ActionClaimTable } from "./ActionClaim";
import { type default as ActionInstancesTable } from "./ActionInstances";
import { type default as ActionMoveTable } from "./ActionMove";
import { type default as ActionRunsTable } from "./ActionRuns";
import { type default as ApiAccessLogsTable } from "./ApiAccessLogs";
import { type default as ApiAccessRulesTable } from "./ApiAccessRules";
import { type default as ApiAccessTokensTable } from "./ApiAccessTokens";
import { type default as AuthTokensTable } from "./AuthTokens";
import { type default as CommunitiesTable } from "./Communities";
import { type default as FormInputsTable } from "./FormInputs";
import { type default as FormsTable } from "./Forms";
import { type default as IntegrationInstancesTable } from "./IntegrationInstances";
import { type default as IntegrationInstanceStateTable } from "./IntegrationInstanceState";
import { type default as IntegrationInstanceToPubTable } from "./IntegrationInstanceToPub";
import { type default as IntegrationsTable } from "./Integrations";
import { type default as MemberGroupsTable } from "./MemberGroups";
import { type default as MemberGroupToUserTable } from "./MemberGroupToUser";
import { type default as MembersTable } from "./Members";
import { type default as MoveConstraintTable } from "./MoveConstraint";
import { type default as PermissionsTable } from "./Permissions";
import { type default as PermissionToPubTable } from "./PermissionToPub";
import { type default as PermissionToStageTable } from "./PermissionToStage";
import { type default as PrismaMigrationsTable } from "./PrismaMigrations";
import { type default as PubFieldsTable } from "./PubFields";
import { type default as PubFieldSchemaTable } from "./PubFieldSchema";
import { type default as PubFieldToPubTypeTable } from "./PubFieldToPubType";
import { type default as PubsTable } from "./Pubs";
import { type default as PubsInStagesTable } from "./PubsInStages";
import { type default as PubTypesTable } from "./PubTypes";
import { type default as PubValuesTable } from "./PubValues";
import { type default as RulesTable } from "./Rules";
import { type default as StagesTable } from "./Stages";
import { type default as UsersTable } from "./Users";

export default interface PublicSchema {
	integration_instances: IntegrationInstancesTable;

	_IntegrationInstanceToPub: IntegrationInstanceToPubTable;

	permissions: PermissionsTable;

	_PermissionToPub: PermissionToPubTable;

	_PermissionToStage: PermissionToStageTable;

	_MemberGroupToUser: MemberGroupToUserTable;

	auth_tokens: AuthTokensTable;

	PubFieldSchema: PubFieldSchemaTable;

	IntegrationInstanceState: IntegrationInstanceStateTable;

	_prisma_migrations: PrismaMigrationsTable;

	users: UsersTable;

	pubs: PubsTable;

	pub_types: PubTypesTable;

	stages: StagesTable;

	members: MembersTable;

	member_groups: MemberGroupsTable;

	integrations: IntegrationsTable;

	communities: CommunitiesTable;

	move_constraint: MoveConstraintTable;

	action_claim: ActionClaimTable;

	action_move: ActionMoveTable;

	pub_fields: PubFieldsTable;

	pub_values: PubValuesTable;

	_PubFieldToPubType: PubFieldToPubTypeTable;

	action_instances: ActionInstancesTable;

	PubsInStages: PubsInStagesTable;

	rules: RulesTable;

	action_runs: ActionRunsTable;

	forms: FormsTable;

	form_inputs: FormInputsTable;

	api_access_tokens: ApiAccessTokensTable;

	api_access_logs: ApiAccessLogsTable;

	api_access_rules: ApiAccessRulesTable;
}
