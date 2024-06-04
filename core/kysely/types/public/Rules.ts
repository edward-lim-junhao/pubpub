// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type RuleConfigs } from "~/actions/types";
import { type ActionInstancesId } from "./ActionInstances";
import { type default as Event } from "./Event";

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
