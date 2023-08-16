import { createNextRoute, createNextRouter } from "@ts-rest/next";
import { api } from "~/lib/contracts";
import { pubQueries, autosuggestQueries } from "~/lib/server";
import { SuggestedMember } from "~/lib/contracts/resources/autosuggest";

const pubRouter = createNextRoute(api.pub, {
	getPubFields: async ({ params }) => {
		const pubFieldValuePairs = await pubQueries.getPubFields(params.pub_id);
		return {
			status: 200,
			body: pubFieldValuePairs,
		};
	},
	putPubFields: async (body) => {
		return {
			status: 200,
			body: {
				id: "qea",
				title: "Watch One Piece",
				body: "Just get to water 7. if you dont like it chill, watch sometyhing welse",
			},
		};
	},
});

const autosuggestRouter = createNextRoute(api.autosuggest, {
	suggestMember: async ({ params }) => {
		const member: SuggestedMember[] = await autosuggestQueries.getMembers(params.input);

		return {
			status: 200,
			body: member,
		};
	},
});

const router = {
	pub: pubRouter,
	autosuggest: autosuggestRouter,
};

export default createNextRouter(api, router);
