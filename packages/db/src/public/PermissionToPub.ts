import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";
import { z } from "zod";

import type { PermissionsId } from "./Permissions";
import type { PubsId } from "./Pubs";
import { permissionsIdSchema } from "./Permissions";
import { pubsIdSchema } from "./Pubs";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Represents the table public._PermissionToPub */
export default interface PermissionToPubTable {
	A: ColumnType<PermissionsId, PermissionsId, PermissionsId>;

	B: ColumnType<PubsId, PubsId, PubsId>;
}

export type PermissionToPub = Selectable<PermissionToPubTable>;

export type NewPermissionToPub = Insertable<PermissionToPubTable>;

export type PermissionToPubUpdate = Updateable<PermissionToPubTable>;

export const permissionToPubSchema = z.object({
	A: permissionsIdSchema,
	B: pubsIdSchema,
}) as z.Schema<PermissionToPub>;

export const permissionToPubInitializerSchema = z.object({
	A: permissionsIdSchema,
	B: pubsIdSchema,
}) as z.Schema<NewPermissionToPub>;

export const permissionToPubMutatorSchema = z.object({
	A: permissionsIdSchema.optional(),
	B: pubsIdSchema.optional(),
}) as z.Schema<PermissionToPubUpdate>;
