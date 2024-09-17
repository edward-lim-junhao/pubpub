// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { z } from "zod";

/** Identifier type for public.communities */
export type CommunitiesId = string & { __brand: "CommunitiesId" };

/** Represents the table public.communities */
export interface CommunitiesTable {
	id: ColumnType<CommunitiesId, CommunitiesId | undefined, CommunitiesId>;

	createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

	updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

	name: ColumnType<string, string, string>;

	avatar: ColumnType<string | null, string | null, string | null>;

	slug: ColumnType<string, string, string>;
}

export type Communities = Selectable<CommunitiesTable>;

export type NewCommunities = Insertable<CommunitiesTable>;

export type CommunitiesUpdate = Updateable<CommunitiesTable>;

export const communitiesIdSchema = z.string().uuid() as unknown as z.Schema<CommunitiesId>;

export const communitiesSchema = z.object({
	id: communitiesIdSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
	name: z.string(),
	avatar: z.string().nullable(),
	slug: z.string(),
});

export const communitiesInitializerSchema = z.object({
	id: communitiesIdSchema.optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	name: z.string(),
	avatar: z.string().optional().nullable(),
	slug: z.string(),
});

export const communitiesMutatorSchema = z.object({
	id: communitiesIdSchema.optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	name: z.string().optional(),
	avatar: z.string().optional().nullable(),
	slug: z.string().optional(),
});
