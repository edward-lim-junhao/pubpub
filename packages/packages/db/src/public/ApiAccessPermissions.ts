// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { apiAccessTokensIdSchema, type ApiAccessTokensId } from './ApiAccessTokens';
import { apiAccessScopeSchema, type default as ApiAccessScope } from './ApiAccessScope';
import { apiAccessTypeSchema, type default as ApiAccessType } from './ApiAccessType';
import { type ApiAccessPermissionConstraints } from '../types';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.api_access_permissions */
export type ApiAccessPermissionsId = string & { __brand: 'ApiAccessPermissionsId' };

/** Represents the table public.api_access_permissions */
export default interface ApiAccessPermissionsTable {
  id: ColumnType<ApiAccessPermissionsId, ApiAccessPermissionsId | undefined, ApiAccessPermissionsId>;

  apiAccessTokenId: ColumnType<ApiAccessTokensId, ApiAccessTokensId, ApiAccessTokensId>;

  scope: ColumnType<ApiAccessScope, ApiAccessScope, ApiAccessScope>;

  accessType: ColumnType<ApiAccessType, ApiAccessType, ApiAccessType>;

  constraints: ColumnType<ApiAccessPermissionConstraints | null, ApiAccessPermissionConstraints | null, ApiAccessPermissionConstraints | null>;
}

export type ApiAccessPermissions = Selectable<ApiAccessPermissionsTable>;

export type NewApiAccessPermissions = Insertable<ApiAccessPermissionsTable>;

export type ApiAccessPermissionsUpdate = Updateable<ApiAccessPermissionsTable>;

export const apiAccessPermissionsIdSchema = z.string().uuid() as unknown as z.Schema<ApiAccessPermissionsId>;

export const apiAccessPermissionsSchema = z.object({
  id: apiAccessPermissionsIdSchema,
  apiAccessTokenId: apiAccessTokensIdSchema,
  scope: apiAccessScopeSchema,
  accessType: apiAccessTypeSchema,
  constraints: z.unknown().nullable(),
}) as z.ZodObject<{[K in keyof ApiAccessPermissions]: z.Schema<ApiAccessPermissions[K]>}>;

export const apiAccessPermissionsInitializerSchema = z.object({
  id: apiAccessPermissionsIdSchema.optional(),
  apiAccessTokenId: apiAccessTokensIdSchema,
  scope: apiAccessScopeSchema,
  accessType: apiAccessTypeSchema,
  constraints: z.unknown().optional().nullable(),
}) as z.ZodObject<{[K in keyof NewApiAccessPermissions]: z.Schema<NewApiAccessPermissions[K]>}>;

export const apiAccessPermissionsMutatorSchema = z.object({
  id: apiAccessPermissionsIdSchema.optional(),
  apiAccessTokenId: apiAccessTokensIdSchema.optional(),
  scope: apiAccessScopeSchema.optional(),
  accessType: apiAccessTypeSchema.optional(),
  constraints: z.unknown().optional().nullable(),
}) as z.ZodObject<{[K in keyof ApiAccessPermissionsUpdate]: z.Schema<ApiAccessPermissionsUpdate[K]>}>;