"use server";

import { PubValues } from "@pubpub/sdk";
import { getInstanceConfig } from "~/lib/instance";
import { makePubFromDoi, makePubFromTitle, makePubFromUrl } from "~/lib/metadata";
import { client } from "~/lib/pubpub";

export const submit = async (instanceId: string, values: PubValues) => {
	try {
		const instance = await getInstanceConfig(instanceId);
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
	"unjournal:doi": makePubFromDoi,
	"unjournal:url": makePubFromUrl,
	"unjournal:title": makePubFromTitle,
};

export const resolveMetadata = async (
	identifierName: string,
	identifierValue: string
): Promise<Record<string, unknown> | { error: string }> => {
	const resolve = metadataResolvers[identifierName];
	try {
		if (resolve !== undefined) {
			const pub = await resolve(identifierValue);
			if (pub !== null) {
				return pub;
			}
		}
	} catch (error) {
		return { error: "There was an error resolving metadata." };
	}
	return { error: "No metdata found." };
};
