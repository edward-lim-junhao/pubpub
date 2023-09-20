"use server";

import { PubValues } from "@pubpub/sdk";
import { assert } from "utils";
import { findInstance } from "~/lib/instance";
import { makePubFromDoi, makePubFromTitle, makePubFromUrl } from "~/lib/metadata";
import { client } from "~/lib/pubpub";

export const submit = async (instanceId: string, values: PubValues) => {
	try {
		assert(typeof instanceId === "string");
		const instance = await findInstance(instanceId);
		if (instance === undefined) {
			return { error: "Instance not configured" };
		}
		const pub = await client.createPub(instanceId, {
			values,
			pubTypeId: instance.pubTypeId,
		});
		return pub;
	} catch (error) {
		return { error: error.message };
	}
};

const metadataResolvers = {
	DOI: makePubFromDoi,
	URL: makePubFromUrl,
	Title: makePubFromTitle,
};

export const resolveMetadata = async (
	identifierName: string,
	identifierValue: string
): Promise<Record<string, unknown> | { error: string }> => {
	const resolve = metadataResolvers[identifierName];
	if (resolve !== undefined) {
		const pub = await resolve(identifierValue);
		if (pub !== null) {
			return pub;
		}
	}
	return { error: "Unable to fetch metadata" };
};
