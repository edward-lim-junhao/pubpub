// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type ApiAccessPermissionConstraints } from "../types";
import { type default as ApiAccessScope } from "./ApiAccessScope";
import { type ApiAccessTokensId } from "./ApiAccessTokens";
import { type default as ApiAccessType } from "./ApiAccessType";

/** Identifier type for public.api_access_permissions */
export type ApiAccessPermissionsId = string & { __brand: "ApiAccessPermissionsId" };

/** Represents the table public.api_access_permissions */
export default interface ApiAccessPermissionsTable {
	id: ColumnType<
		ApiAccessPermissionsId,
		ApiAccessPermissionsId | undefined,
		ApiAccessPermissionsId
	>;

	apiAccessTokenId: ColumnType<ApiAccessTokensId, ApiAccessTokensId, ApiAccessTokensId>;

	scope: ColumnType<ApiAccessScope, ApiAccessScope, ApiAccessScope>;

	accessType: ColumnType<ApiAccessType, ApiAccessType, ApiAccessType>;

	constraints: ColumnType<
		ApiAccessPermissionConstraints | null,
		ApiAccessPermissionConstraints | null,
		ApiAccessPermissionConstraints | null
	>;
}

export type ApiAccessPermissions = Selectable<ApiAccessPermissionsTable>;

export type NewApiAccessPermissions = Insertable<ApiAccessPermissionsTable>;

export type ApiAccessPermissionsUpdate = Updateable<ApiAccessPermissionsTable>;
