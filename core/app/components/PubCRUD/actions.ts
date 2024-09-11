"use server";

import type { JSONSchemaType } from "ajv";

import { revalidatePath, revalidateTag } from "next/cache";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import type { JsonValue } from "contracts";
import type { CommunitiesId, PubFieldsId, PubsId, PubTypesId, StagesId } from "db/public";
import { logger } from "logger";

import { validatePubValues, validatePubValuesBySchemaName } from "~/actions/_lib/validateFields";
import { db } from "~/kysely/database";
import { getLoginData } from "~/lib/auth/loginData";
import { isCommunityAdmin } from "~/lib/auth/roles";
import { autoRevalidate } from "~/lib/server/cache/autoRevalidate";
import { defineServerAction } from "~/lib/server/defineServerAction";

export const createPub = defineServerAction(async function createPub({
	communityId,
	stageId,
	pubTypeId,
	fields,
	path,
	parentId,
}: {
	communityId: CommunitiesId;
	stageId: StagesId;
	pubTypeId: PubTypesId;
	fields: { [id: PubFieldsId]: { slug: string; value: JsonValue } };
	path?: string | null;
	parentId?: PubsId;
}) {
	const { user } = await getLoginData();
	if (!user) {
		throw new Error("Not logged in");
	}

	if (!isCommunityAdmin(user, { id: communityId })) {
		return {
			error: "You need to be an admin",
		};
	}

	try {
		await autoRevalidate(
			db
				.with("new_pub", (db) =>
					db
						.insertInto("pubs")
						.values({
							communityId: communityId,
							pubTypeId: pubTypeId,
							parentId: parentId,
						})
						.returning("id")
				)
				.with("stage_create", (db) =>
					db.insertInto("PubsInStages").values((eb) => ({
						pubId: eb.selectFrom("new_pub").select("new_pub.id"),
						stageId,
					}))
				)

				.insertInto("pub_values")
				.values((eb) =>
					Object.entries(fields).map(([key, value]) => ({
						fieldId: key as PubFieldsId,
						pubId: eb.selectFrom("new_pub").select("new_pub.id"),
						value: JSON.stringify(value.value),
					}))
				)
		).execute();

		if (path) {
			revalidatePath(path);
		}

		return {
			success: true,
			report: `Successfully created a new Pub`,
		};
	} catch (error) {
		logger.error(error);
		return {
			error: "Failed to create pub",
			cause: error,
		};
	}
});

const stageMove = (pubId: PubsId, stageId?: StagesId) =>
	stageId &&
	db.transaction().execute(async (trx) => {
		trx.deleteFrom("PubsInStages").where("PubsInStages.pubId", "=", pubId).execute();
		autoRevalidate(trx.insertInto("PubsInStages").values({ pubId, stageId })).execute();
	});

export const _upsertPubValues = async ({
	pubId,
	values,
	stageId,
}: {
	pubId: PubsId;
	values: Record<string, JsonValue>;
	stageId?: StagesId;
}) => {
	// First query for existing values so we know whether to insert or update.
	// Also get the schemaName for validation. We want the fields that may not be in the pub, too.
	const toBeUpdatedPubFieldSlugs = Object.keys(values);

	if (!toBeUpdatedPubFieldSlugs.length) {
		await stageMove(pubId, stageId);
		return {
			success: true,
			report: `No fields to update`,
		};
	}

	const pubFields = await db
		.selectFrom("pub_fields")
		.leftJoin("pub_values", "pub_values.fieldId", "pub_fields.id")
		.where((eb) =>
			eb("pub_values.pubId", "=", pubId).or("pub_fields.slug", "in", toBeUpdatedPubFieldSlugs)
		)
		.distinctOn("pub_fields.slug")
		.select(["pub_fields.slug", "pub_fields.name", "pub_fields.schemaName"])
		.execute();

	const validated = validatePubValuesBySchemaName({
		fields: pubFields,
		values,
	});

	if (validated && validated.error) {
		return {
			error: validated.error,
			cause: validated.error,
		};
	}

	// Insert, update on conflict
	const upsert = autoRevalidate(
		db
			.insertInto("pub_values")
			.values((eb) => {
				return Object.entries(values).map(([slug, value]) => {
					return {
						pubId,
						value: JSON.stringify(value),
						fieldId: eb
							.selectFrom("pub_fields")
							.where("pub_fields.slug", "=", slug)
							.select("pub_fields.id"),
					};
				});
			})
			.onConflict((oc) =>
				oc.constraint("pub_values_pubId_relatedPubId_fieldId_key").doUpdateSet((eb) => ({
					value: eb.ref("excluded.value"),
				}))
			)
			.returningAll()
	).execute();
	const stageMoveQuery = stageMove(pubId, stageId);
	const upsertPub = await Promise.allSettled([
		upsert,
		...(stageMoveQuery ? [stageMoveQuery] : []),
	]);

	const errors = upsertPub.filter(
		(pubValue): pubValue is typeof pubValue & { status: "rejected" } =>
			pubValue.status === "rejected"
	);
	if (errors.length > 0) {
		return {
			title: "Failed to update pub",
			error: `${errors[0]?.reason}`,
			cause: errors,
		};
	}

	revalidateTag(`pubs_${pubId}`);

	return {
		success: true,
		report: `Successfully updated the Pub`,
	};
};

export const upsertPubValues = defineServerAction(async function upsertPubValues({
	pubId,
	values,
	path,
	stageId,
}: {
	pubId: PubsId;
	values: Record<string, JsonValue>;
	path?: string | null;
	stageId?: StagesId;
}) {
	const loginData = await getLoginData();

	if (!loginData) {
		throw new Error("Not logged in");
	}

	try {
		const result = await _upsertPubValues({ pubId, values, stageId });
		if (path) {
			revalidatePath(path);
		}

		return result;
	} catch (error) {
		logger.error(error);
		return {
			error: "Failed to update pub",
			cause: error,
		};
	}
});

export const _updatePub = async ({
	stageId,
	pubId,
	fields,
}: {
	stageId?: StagesId;
	pubId: PubsId;
	fields: { slug: string; value: JsonValue }[];
}) => {
	// create a list of slugs to be updated
	const toBeUpdatedPubFieldSlugs = fields.map(({ slug }) => slug);
	console.log("\n\nFiled slugs to be updated", toBeUpdatedPubFieldSlugs);

	// this gets the old values for the pub we want to update
	const toBeUpdatedPubValues = await db
		.selectFrom("pub_values")
		.select((eb) => [
			"id",
			"value",
			"pubId",
			"pub_values.fieldId",
			jsonObjectFrom(
				eb
					.selectFrom("pub_fields")
					.select((eb) => [
						"pub_fields.id",
						"pub_fields.name",
						"pub_fields.pubFieldSchemaId",
						"pub_fields.slug",
						jsonObjectFrom(
							eb
								.selectFrom("PubFieldSchema")
								.selectAll()
								.whereRef("PubFieldSchema.id", "=", "pub_fields.pubFieldSchemaId")
						).as("schema"),
					])
					.whereRef("pub_fields.id", "=", "pub_values.fieldId")
					.where("pub_fields.slug", "in", toBeUpdatedPubFieldSlugs)
			).as("field"),
		])
		.where("pub_values.pubId", "=", pubId)
		.execute();
	console.log("\n\nPub Values???", toBeUpdatedPubValues);

	const stageMoveQuery =
		stageId &&
		db.transaction().execute(async (trx) => {
			trx.deleteFrom("PubsInStages").where("PubsInStages.pubId", "=", pubId).execute();
			autoRevalidate(trx.insertInto("PubsInStages").values({ pubId, stageId })).execute();
		});

	// this includes the value for the new field we added
	const newValues = Object.fromEntries(
		fields.map(({ slug, value }) => [slug, JSON.stringify(value)])
	);
	const pubFields = toBeUpdatedPubValues
		.map((pubValue) => pubValue.field)
		.filter(
			(
				field
			): // bless this mess
			field is NonNullable<
				typeof field & {
					schema: NonNullable<NonNullable<typeof field>["schema"]> & {
						schema: JSONSchemaType<any>;
					};
				}
			> => field !== null && field.schema !== null && field.schema.schema !== null
		);
	console.log("\n\nPub Fields that will def get sent to the db", pubFields);
	const validated = validatePubValues({
		fields: pubFields,
		values: newValues,
	});

	if (validated && validated.error) {
		return {
			error: validated.error,
			cause: validated.error,
		};
	}
	const queries = [
		toBeUpdatedPubValues.map(async (pubValue) => {
			const field = fields.find((f) => f.slug === pubValue.field?.slug);
			if (!field) {
				logger.debug({
					msg: `Field ${pubValue.field?.slug} not found in fields`,
					fields,
					pubValue,
				});
				return;
			}
			const { value } = field;
			// console.log("\n\nVALUE", value);
			return autoRevalidate(
				db
					.updateTable("pub_values")
					.set({
						value: JSON.stringify(value),
					})
					.where("pub_values.id", "=", pubValue.id)
					.returningAll()
			).execute();
		}),
	]
		.filter((x) => x != null)
		.flat();

	const updatePub = await Promise.allSettled([
		...queries,
		...(stageMoveQuery ? [stageMoveQuery] : []),
	]);

	const errors = updatePub.filter(
		(pubValue): pubValue is typeof pubValue & { status: "rejected" } =>
			pubValue.status === "rejected"
	);
	if (errors.length > 0) {
		return {
			title: "Failed to update pub",
			error: `${errors[0]?.reason}`,
			cause: errors,
		};
	}
	revalidateTag(`pubs_${pubId}`);

	return {
		success: true,
		report: `Successfully updated the Pub`,
	};
};

export const updatePub = defineServerAction(async function updatePub({
	communityId,
	pubId,
	fields,
	path,
	stageId,
}: {
	communityId: CommunitiesId;
	pubId: PubsId;
	fields: { [id: PubFieldsId]: { slug: string; value: JsonValue } };
	path?: string | null;
	stageId?: StagesId;
}) {
	const { user } = await getLoginData();

	if (!user) {
		throw new Error("Not logged in");
	}

	if (!isCommunityAdmin(user, { id: communityId })) {
		return {
			error: "You need to be an admin",
		};
	}

	const mappedFields = Object.values(fields).map(({ slug, value }) => ({
		slug,
		value,
	}));
	try {
		const result = await _updatePub({ stageId, pubId, fields: mappedFields });
		if (path) {
			revalidatePath(path);
		}

		return result;
	} catch (error) {
		logger.error(error);
		return {
			error: "Failed to update pub",
			cause: error,
		};
	}
});

export const removePub = defineServerAction(async function removePub({
	pubId,
	path,
}: {
	pubId: PubsId;
	path?: string | null;
}) {
	const { user } = await getLoginData();

	if (!user) {
		throw new Error("Not logged in");
	}
	const pub = await db
		.selectFrom("pubs")
		.selectAll()
		.where("pubs.id", "=", pubId)
		.executeTakeFirst();

	if (!pub) {
		return {
			error: "Pub not found",
		};
	}

	if (!isCommunityAdmin(user, { id: pub.communityId })) {
		return {
			error: "You need to be an admin of this community to remove this pub.",
		};
	}

	try {
		await autoRevalidate(db.deleteFrom("pubs").where("pubs.id", "=", pubId)).executeTakeFirst();

		if (path) {
			revalidatePath(path);
		}
		return {
			success: true,
			report: `Successfully removed the pub`,
		};
	} catch (error) {
		logger.debug(error);
		return {
			error: "Failed to remove pub",
			cause: error,
		};
	}
});
