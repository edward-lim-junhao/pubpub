// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type PubsId } from './Pubs';
import { type StagesId } from './Stages';
import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';

/** Represents the table public._PubToStage */
export default interface PubToStageTable {
  A: ColumnType<PubsId, PubsId, PubsId>;

  B: ColumnType<StagesId, StagesId, StagesId>;
}

export type PubToStage = Selectable<PubToStageTable>;

export type NewPubToStage = Insertable<PubToStageTable>;

export type PubToStageUpdate = Updateable<PubToStageTable>;
