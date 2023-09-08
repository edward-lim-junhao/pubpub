import { z } from "zod";
import { initContract } from "@ts-rest/core";

const contract = initContract();

const PubFieldsSchema = z.any();

const PubPostSchema = z.object({
	pubTypeId: z.string(),
	pubFields: PubFieldsSchema,
});
const SuggestedMembersSchema = z.object({
	id: z.string(),
	name: z.string(),
});

const UserSchema = z.object({
	id: z.string(),
	slug: z.string(),
	email: z.string(),
	name: z.string(),
	avatar: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type PubFieldsResponse = z.infer<typeof PubFieldsSchema>;
export type PubPostBody = z.infer<typeof PubPostSchema>;
export type SuggestedMember = z.infer<typeof SuggestedMembersSchema>;

export const integrationsApi = contract.router({
	auth: {
		headers: z.object({
			authorization: z.string(),
		}),
		method: "GET",
		path: "/integrations/:instanceId/auth",
		summary: "Authenticate a user and receive basic information about them",
		description:
			"Integrations can use this endpoint to exchange a PubPub community member's auth token for information about them.",
		pathParams: z.object({
			instanceId: z.string(),
		}),
		responses: {
			200: UserSchema,
		},
	},
	createPub: {
		method: "POST",
		path: "/integrations/:instanceId/pubs",
		summary: "Creates a new pub",
		description: "A way to create a new pub",
		body: PubPostSchema,
		pathParams: z.object({
			instanceId: z.string(),
		}),
		responses: {
			200: PubFieldsSchema,
			404: z.object({ message: z.string() }),
		},
	},
	getPub: {
		method: "GET",
		path: "/integrations/:instanceId/pubs/:pubId",
		summary: "Gets a pub",
		description: "A way to get pubs fields for an integration instance",
		pathParams: z.object({
			pubId: z.string(),
			instanceId: z.string(),
		}),
		responses: {
			200: z.array(PubFieldsSchema),
		},
	},
	getAllPubs: {
		method: "GET",
		path: "/integrations/:instanceId/pubs",
		summary: "Gets all pubs for this instance",
		description: "A way to get all pubs for an integration instance",
		pathParams: z.object({
			instanceId: z.string(),
		}),
		responses: {
			200: z.array(PubFieldsSchema),
		},
	},
	updatePub: {
		method: "PATCH",
		path: "/integrations/:instanceId/pubs/:pubId",
		summary: "Adds field(s) to a pub",
		description: "A way to update a field for an existing pub",
		body: PubFieldsSchema,
		pathParams: z.object({
			pubId: z.string(),
			instanceId: z.string(),
		}),
		responses: {
			200: PubFieldsSchema,
		},
	},
	getSuggestedMembers: {
		method: "GET",
		path: "/integrations/:instanceId/autosuggest/members/:memberCandidateString",
		summary: "autosuggest member",
		description:
			"A way to autosuggest members so that integrations users can find users or verify they exist. Will return a name for ",
		pathParams: z.object({
			memberCandidateString: z.string(),
			instanceId: z.string(),
		}),
		responses: {
			200: z.array(SuggestedMembersSchema),
		},
	},
	sendEmail: {
		method: "POST",
		path: "/integrations/:instanceId/email",
		summary: "Send an email from PubPub to a new or existing PubPub user",
		description: "Recipient can be an existing pubpub user identified by ID, or a new user who must be identified by email and name.",
		body: z.object({
			to: z.object({
				userId: z.string().optional(),
				email: z.string().optional(),
				name: z.string().optional(),
			}),
			subject: z.string(),
			message: z.string(),
		}),
		pathParams: z.object({
			instanceId: z.string(),
		}),
		responses: {
			200: z.undefined(),
		},
	},
	// TODO implement these endpoints
	// getAllMembers: {
	// 	method: "GET",
	// 	path: "integrations/:instanceId/members",
	// 	summary: "Gets all members for this instance",
	// 	description: "A way to get all members for an integration instance",
	// 	pathParams: z.object({
	// 		instanceId: z.string(),
	// 	}),
	// 	responses: {
	// 		200: z.array(SuggestedMembersSchema),
	// 	},
	// },
});
