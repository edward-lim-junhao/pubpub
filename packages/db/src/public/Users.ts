import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.users */
export type UsersId = string & { __brand: 'UsersId' };

/** Represents the table public.users */
export default interface UsersTable {
  id: ColumnType<UsersId, UsersId | undefined, UsersId>;

  slug: ColumnType<string, string, string>;

  email: ColumnType<string, string, string>;

  firstName: ColumnType<string, string, string>;

  avatar: ColumnType<string | null, string | null, string | null>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

  lastName: ColumnType<string | null, string | null, string | null>;

  orcid: ColumnType<string | null, string | null, string | null>;

  supabaseId: ColumnType<string | null, string | null, string | null>;

  isSuperAdmin: ColumnType<boolean, boolean | undefined, boolean>;
}

export type Users = Selectable<UsersTable>;

export type NewUsers = Insertable<UsersTable>;

export type UsersUpdate = Updateable<UsersTable>;

export const usersIdSchema = z.string() as unknown as z.Schema<UsersId>;

export const usersSchema = z.object({
  id: usersId,
  slug: z.string(),
  email: z.string(),
  firstName: z.string(),
  avatar: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastName: z.string().nullable(),
  orcid: z.string().nullable(),
  supabaseId: z.string().nullable(),
  isSuperAdmin: z.boolean(),
}) as unknown as z.Schema<Users>;

export const usersInitializerSchema = z.object({
  id: usersId.optional(),
  slug: z.string(),
  email: z.string(),
  firstName: z.string(),
  avatar: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  lastName: z.string().optional().nullable(),
  orcid: z.string().optional().nullable(),
  supabaseId: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional(),
}) as unknown as z.Schema<NewUsers>;

export const usersMutatorSchema = z.object({
  id: usersId.optional(),
  slug: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  avatar: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  lastName: z.string().optional().nullable(),
  orcid: z.string().optional().nullable(),
  supabaseId: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional(),
}) as unknown as z.Schema<UsersUpdate>;