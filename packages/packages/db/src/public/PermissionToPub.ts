// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { permissionsIdSchema, type PermissionsId } from './Permissions';
import { pubsIdSchema, type PubsId } from './Pubs';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

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
}) as z.ZodObject<{[K in keyof PermissionToPub]: z.Schema<PermissionToPub[K]>}>;

export const permissionToPubInitializerSchema = z.object({
  A: permissionsIdSchema,
  B: pubsIdSchema,
}) as z.ZodObject<{[K in keyof NewPermissionToPub]: z.Schema<NewPermissionToPub[K]>}>;

export const permissionToPubMutatorSchema = z.object({
  A: permissionsIdSchema.optional(),
  B: pubsIdSchema.optional(),
}) as z.ZodObject<{[K in keyof PermissionToPubUpdate]: z.Schema<PermissionToPubUpdate[K]>}>;