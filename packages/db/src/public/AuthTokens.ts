import { usersId, type UsersId } from './Users';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.auth_tokens */
export type AuthTokensId = string & { __brand: 'AuthTokensId' };

/** Represents the table public.auth_tokens */
export default interface AuthTokensTable {
  id: ColumnType<AuthTokensId, AuthTokensId, AuthTokensId>;

  hash: ColumnType<string, string, string>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  expiresAt: ColumnType<Date, Date | string, Date | string>;

  isUsed: ColumnType<boolean, boolean | undefined, boolean>;

  userId: ColumnType<UsersId, UsersId, UsersId>;
}

export type AuthTokens = Selectable<AuthTokensTable>;

export type NewAuthTokens = Insertable<AuthTokensTable>;

export type AuthTokensUpdate = Updateable<AuthTokensTable>;

export const authTokensIdSchema = z.string() as unknown as z.Schema<AuthTokensId>;

export const authTokensSchema = z.object({
  id: authTokensId,
  hash: z.string(),
  createdAt: z.date(),
  expiresAt: z.date(),
  isUsed: z.boolean(),
  userId: usersId,
}) as unknown as z.Schema<AuthTokens>;

export const authTokensInitializerSchema = z.object({
  id: authTokensId,
  hash: z.string(),
  createdAt: z.date().optional(),
  expiresAt: z.date(),
  isUsed: z.boolean().optional(),
  userId: usersId,
}) as unknown as z.Schema<NewAuthTokens>;

export const authTokensMutatorSchema = z.object({
  id: authTokensId.optional(),
  hash: z.string().optional(),
  createdAt: z.date().optional(),
  expiresAt: z.date().optional(),
  isUsed: z.boolean().optional(),
  userId: usersId.optional(),
}) as unknown as z.Schema<AuthTokensUpdate>;