// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { actionInstancesIdSchema, type ActionInstancesId } from './ActionInstances';
import { pubsIdSchema, type PubsId } from './Pubs';
import { eventSchema, type default as Event } from './Event';
import { actionRunStatusSchema, type default as ActionRunStatus } from './ActionRunStatus';
import { usersIdSchema, type UsersId } from './Users';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.action_runs */
export type ActionRunsId = string & { __brand: 'ActionRunsId' };

/** Represents the table public.action_runs */
export default interface ActionRunsTable {
  id: ColumnType<ActionRunsId, ActionRunsId | undefined, ActionRunsId>;

  actionInstanceId: ColumnType<ActionInstancesId | null, ActionInstancesId | null, ActionInstancesId | null>;

  pubId: ColumnType<PubsId | null, PubsId | null, PubsId | null>;

  config: ColumnType<unknown | null, unknown | null, unknown | null>;

  event: ColumnType<Event | null, Event | null, Event | null>;

  params: ColumnType<unknown | null, unknown | null, unknown | null>;

  status: ColumnType<ActionRunStatus, ActionRunStatus, ActionRunStatus>;

  userId: ColumnType<UsersId | null, UsersId | null, UsersId | null>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;

  result: ColumnType<unknown, unknown, unknown>;
}

export type ActionRuns = Selectable<ActionRunsTable>;

export type NewActionRuns = Insertable<ActionRunsTable>;

export type ActionRunsUpdate = Updateable<ActionRunsTable>;

export const actionRunsIdSchema = z.string().uuid() as unknown as z.Schema<ActionRunsId>;

export const actionRunsSchema = z.object({
  id: actionRunsIdSchema,
  actionInstanceId: actionInstancesIdSchema.nullable(),
  pubId: pubsIdSchema.nullable(),
  config: z.unknown().nullable(),
  event: eventSchema.nullable(),
  params: z.unknown().nullable(),
  status: actionRunStatusSchema,
  userId: usersIdSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  result: z.unknown(),
}) as z.ZodObject<{[K in keyof ActionRuns]: z.Schema<ActionRuns[K]>}>;

export const actionRunsInitializerSchema = z.object({
  id: actionRunsIdSchema.optional(),
  actionInstanceId: actionInstancesIdSchema.optional().nullable(),
  pubId: pubsIdSchema.optional().nullable(),
  config: z.unknown().optional().nullable(),
  event: eventSchema.optional().nullable(),
  params: z.unknown().optional().nullable(),
  status: actionRunStatusSchema,
  userId: usersIdSchema.optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  result: z.unknown(),
}) as z.ZodObject<{[K in keyof NewActionRuns]: z.Schema<NewActionRuns[K]>}>;

export const actionRunsMutatorSchema = z.object({
  id: actionRunsIdSchema.optional(),
  actionInstanceId: actionInstancesIdSchema.optional().nullable(),
  pubId: pubsIdSchema.optional().nullable(),
  config: z.unknown().optional().nullable(),
  event: eventSchema.optional().nullable(),
  params: z.unknown().optional().nullable(),
  status: actionRunStatusSchema.optional(),
  userId: usersIdSchema.optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  result: z.unknown().optional(),
}) as z.ZodObject<{[K in keyof ActionRunsUpdate]: z.Schema<ActionRunsUpdate[K]>}>;