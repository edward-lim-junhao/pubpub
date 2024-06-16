import type { ExpressionBuilder, ExpressionWrapper } from "kysely";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

import type { CommunitiesId } from "~/kysely/types/public/Communities";
import type PublicSchema from "~/kysely/types/public/PublicSchema";
import type { StagesId } from "~/kysely/types/public/Stages";
import { db } from "~/kysely/database";
import { autoCache } from "~/lib/server/cache/autoCache";
import { SkeletonCard } from "../skeletons/SkeletonCard";

export type CreatePubProps =
	| {
			communityId: CommunitiesId;
			stageId?: never;
	  }
	| {
			stageId: StagesId;
			communityId?: never;
	  };

const getCommunityById = <EB extends ExpressionBuilder<PublicSchema, keyof PublicSchema>>(
	eb: EB,
	communityId: CommunitiesId | ExpressionWrapper<PublicSchema, "stages", CommunitiesId>
) => {
	const query = eb.selectFrom("communities").select((eb) => [
		"communities.id",
		jsonArrayFrom(
			eb
				.selectFrom("pub_types")
				.select((eb) => [
					"pub_types.id",
					"pub_types.name",
					"pub_types.description",
					jsonArrayFrom(
						eb
							.selectFrom("pub_fields")
							.innerJoin("_PubFieldToPubType", "A", "pub_fields.id")
							.select((eb) => [
								"pub_fields.id",
								"pub_fields.name",
								"pub_fields.pubFieldSchemaId",
								"pub_fields.slug",
								"pub_fields.name",
								jsonObjectFrom(
									eb
										.selectFrom("PubFieldSchema")
										.select([
											"PubFieldSchema.id",
											"PubFieldSchema.namespace",
											"PubFieldSchema.name",
											"PubFieldSchema.schema",
										])
										.whereRef(
											"PubFieldSchema.id",
											"=",
											eb.ref("pub_fields.pubFieldSchemaId")
										)
								).as("schema"),
							])
							.where("_PubFieldToPubType.B", "=", eb.ref("pub_types.id"))
					).as("fields"),
				])
				.whereRef("pub_types.community_id", "=", eb.ref("communities.id"))
		).as("pubTypes"),
		jsonArrayFrom(
			eb
				.selectFrom("stages")
				.select(["stages.id", "stages.name", "stages.order"])
				.orderBy("stages.order desc")
				.where("stages.community_id", "=", communityId)
		).as("stages"),
	]);

	const completeQuery =
		typeof communityId === "string"
			? query.where("communities.id", "=", communityId)
			: query.whereRef("communities.id", "=", communityId);

	//		return { qb: completeQuery };
	return completeQuery; //.executeTakeFirstOrThrow();
};

const getStage = (stageId: StagesId) =>
	db
		.selectFrom("stages")
		.select((eb) => [
			"stages.id",
			"stages.community_id",
			"stages.name",
			"stages.order",
			jsonObjectFrom(getCommunityById(eb, eb.ref("stages.community_id"))).as("community"),
		])
		.where("stages.id", "=", stageId)
		.executeTakeFirstOrThrow();

const PubCreateForm = dynamic(
	async () => {
		return import("./PubCreateForm").then((mod) => ({
			default: mod.PubCreateForm,
		}));
	},
	{ ssr: false, loading: () => <SkeletonCard /> }
);

export async function PubCreate({ communityId, stageId }: CreatePubProps) {
	const query = stageId
		? getStage(stageId)
		: getCommunityById(db, communityId).executeTakeFirstOrThrow();
	// 		// @ts-expect-error FIXME: I don't know how to fix this
	// 		db,
	// 		communityId
	// 	);
	const result = await query;

	const { community, ...stage } = "community_id" in result ? result : { community: result };
	const currentStage = "id" in stage ? stage : null;

	if (!community) {
		return null;
	}

	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<PubCreateForm
					currentStage={currentStage}
					communityId={community.id}
					availableStages={community.stages}
					availablePubTypes={community.pubTypes}
				/>
			</Suspense>
		</>
	);
}