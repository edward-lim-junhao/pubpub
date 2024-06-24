import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";
import { z } from "zod";

import type { ActionInstancesId } from "./ActionInstances";
import type { default as Event } from "./Event";
import { type RuleConfigs } from "~/actions/types";
import { actionInstancesIdSchema } from "./ActionInstances";
import { eventSchema } from "./Event";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.rules */
export type RulesId = string & { __brand: "RulesId" };

/** Represents the table public.rules */
export default interface RulesTable {
	id: ColumnType<RulesId, RulesId | undefined, RulesId>;

	event: ColumnType<Event, Event, Event>;

	actionInstanceId: ColumnType<ActionInstancesId, ActionInstancesId, ActionInstancesId>;

	config: ColumnType<RuleConfigs | null, RuleConfigs | null, RuleConfigs | null>;
}

export type Rules = Selectable<RulesTable>;

export type NewRules = Insertable<RulesTable>;

export type RulesUpdate = Updateable<RulesTable>;

export const rulesIdSchema = z.string().uuid() as unknown as z.Schema<RulesId>;

export const rulesSchema = z.object({
	id: rulesIdSchema,
	event: eventSchema,
	actionInstanceId: actionInstancesIdSchema,
	config: z.unknown().nullable(),
}) as z.ZodObject<{ [K in keyof Rules]: z.Schema<Rules[K]> }>;

export const rulesInitializerSchema = z.object({
	id: rulesIdSchema.optional(),
	event: eventSchema,
	actionInstanceId: actionInstancesIdSchema,
	config: z.unknown().optional().nullable(),
}) as z.ZodObject<{ [K in keyof NewRules]: z.Schema<NewRules[K]> }>;

export const rulesMutatorSchema = z.object({
	id: rulesIdSchema.optional(),
	event: eventSchema.optional(),
	actionInstanceId: actionInstancesIdSchema.optional(),
	config: z.unknown().optional().nullable(),
}) as z.ZodObject<{ [K in keyof RulesUpdate]: z.Schema<RulesUpdate[K]> }>;
