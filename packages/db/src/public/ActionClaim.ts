import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";
import { z } from "zod";

import type { PubsId } from "./Pubs";
import type { StagesId } from "./Stages";
import type { UsersId } from "./Users";
import { pubsIdSchema } from "./Pubs";
import { stagesIdSchema } from "./Stages";
import { usersIdSchema } from "./Users";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.action_claim */
export type ActionClaimId = string & { __brand: "ActionClaimId" };

/** Represents the table public.action_claim */
export default interface ActionClaimTable {
	id: ColumnType<ActionClaimId, ActionClaimId | undefined, ActionClaimId>;

	stageId: ColumnType<StagesId, StagesId, StagesId>;

	pubId: ColumnType<PubsId, PubsId, PubsId>;

	userId: ColumnType<UsersId, UsersId, UsersId>;

	releasedAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

	createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

	updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type ActionClaim = Selectable<ActionClaimTable>;

export type NewActionClaim = Insertable<ActionClaimTable>;

export type ActionClaimUpdate = Updateable<ActionClaimTable>;

export const actionClaimIdSchema = z.string().uuid() as unknown as z.Schema<ActionClaimId>;

export const actionClaimSchema = z.object({
	id: actionClaimIdSchema,
	stageId: stagesIdSchema,
	pubId: pubsIdSchema,
	userId: usersIdSchema,
	releasedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) as z.Schema<ActionClaim>;

export const actionClaimInitializerSchema = z.object({
	id: actionClaimIdSchema.optional(),
	stageId: stagesIdSchema,
	pubId: pubsIdSchema,
	userId: usersIdSchema,
	releasedAt: z.date().optional().nullable(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
}) as z.Schema<NewActionClaim>;

export const actionClaimMutatorSchema = z.object({
	id: actionClaimIdSchema.optional(),
	stageId: stagesIdSchema.optional(),
	pubId: pubsIdSchema.optional(),
	userId: usersIdSchema.optional(),
	releasedAt: z.date().optional().nullable(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
}) as z.Schema<ActionClaimUpdate>;
