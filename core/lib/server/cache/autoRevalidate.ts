import { revalidatePath, revalidateTag } from "next/cache";

import { logger } from "logger";

import type { autoCache } from "./autoCache";
import type { AutoOptions, AutoRevalidateOptions, DirectAutoOutput, ExecuteFn, MQB } from "./types";
import { db } from "~/kysely/database";
import { env } from "~/lib/env/env.mjs";
import { getCommunitySlug } from "./getCommunitySlug";
import { revalidateTagsForCommunity } from "./revalidate";
import { cachedFindTables, directAutoOutput } from "./sharedAuto";

const executeWithRevalidate = <
	Q extends MQB<any>,
	M extends "execute" | "executeTakeFirst" | "executeTakeFirstOrThrow",
>(
	qb: Q,
	method: M,
	options?: AutoRevalidateOptions
) => {
	const executeFn = async () => {
		const communitySlug = options?.communitySlug ?? getCommunitySlug();

		const communitySlugs = Array.isArray(communitySlug) ? communitySlug : [communitySlug];

		const compiledQuery = qb.compile();

		const tables = await cachedFindTables(compiledQuery, "mutation");

		// necessary assertion here due to
		// https://github.com/microsoft/TypeScript/issues/241
		const result = await (qb[method]() as ReturnType<Q[M]>);

		revalidateTagsForCommunity(tables, communitySlugs);

		// const tableTags = createCommunityCacheTags(tables, communitySlug);

		// const tagsToRevalidate = [...tableTags, ...(options?.additionalRevalidateTags ?? [])];
		[...(options?.additionalRevalidateTags ?? [])].forEach((tag) => {
			if (env.CACHE_LOG) {
				logger.debug(`AUTOREVALIDATE: Revalidating tag: ${tag}`);
			}
			revalidateTag(tag);
		});

		if (options?.additionalRevalidatePaths) {
			options?.additionalRevalidatePaths.forEach((path) => {
				if (env.CACHE_LOG) {
					logger.debug(`AUTOREVALIDATE: Revalidating path: ${path}`);
				}
				revalidatePath(path);
			});
		}

		return result;
	};

	// we are reaching the limit of typescript's type inference here
	// without this cast, the return type of the function
	// is missing an `Awaited`
	// possibly an instance of this 10(!) year old issue, as when
	// i leave out the type in qb[method], you get ()=>any
	// https://github.com/microsoft/TypeScript/issues/241
	return executeFn as ExecuteFn<Q, M>;
};

/**
 * **🪄 autoRevalidate**
 *
 * Automatically revalidates the cache tags of a mutation query after it's executed.
 *
 * See {@link autoCache} for a more detailed explanation of the API.
 */
export function autoRevalidate<Q extends MQB<any>>(
	qb: Q,
	options?: AutoRevalidateOptions
): DirectAutoOutput<Q> {
	return directAutoOutput(
		qb,
		executeWithRevalidate,
		// @ts-expect-error FIXME: this should just work, no clue
		// why typescript is being so difficult
		options
	);
}