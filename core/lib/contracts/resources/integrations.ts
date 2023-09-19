import { Prisma } from "@prisma/client";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

export type JsonInput = Prisma.InputJsonValue;
export const JsonInput: z.ZodType<JsonInput> = z.lazy(() =>
	z.union([
		z.union([z.string(), z.number(), z.boolean()]),
		z.array(JsonInput),
		z.record(JsonInput),
	])
);
export type JsonOutput = Prisma.JsonValue;
export const JsonOutput: z.ZodType<JsonOutput> = z.lazy(() =>
	z.union([
		z.union([z.string(), z.number(), z.boolean()]),
		z.array(JsonOutput),
		z.record(JsonOutput),
	])
);

export const PubValuesRequestBody = z.record(JsonInput);
export const PubValuesResponseBody = z.record(JsonOutput);

const BaseCreatePubRequestBody = z.object({
	id: z.string().optional(),
	parentId: z.string().optional(),
	pubTypeId: z.string(),
	values: PubValuesRequestBody,
});

export type CreatePubRequestBody = z.infer<typeof BaseCreatePubRequestBody> & {
	children?: CreatePubRequestBody[];
};

export const CreatePubRequestBody: z.ZodType<CreatePubRequestBody> =
	BaseCreatePubRequestBody.extend({
		children: z.lazy(() => CreatePubRequestBody.array().optional()),
	});

export const BaseCreatePubResponseBody = z.object({
	id: z.string(),
	communityId: z.string(),
	pubTypeId: z.string(),
	parentId: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type CreatePubResponseBody = z.infer<typeof BaseCreatePubResponseBody> & {
	children: CreatePubResponseBody[];
};

export const CreatePubResponseBody: z.ZodType<CreatePubResponseBody> =
	BaseCreatePubResponseBody.extend({
		children: z.lazy(() => CreatePubResponseBody.array()),
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

export type PubFieldsResponse = z.infer<typeof PubValuesResponseBody>;
export type SuggestedMember = z.infer<typeof SuggestedMembersSchema>;

const contract = initContract();

export const integrationsApi = contract.router(
	{
		auth: {
			method: "GET",
			path: "/:instanceId/auth",
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
			path: "/:instanceId/pubs",
			summary: "Creates a new pub",
			description: "A way to create a new pub",
			body: CreatePubRequestBody,
			pathParams: z.object({
				instanceId: z.string(),
			}),
			responses: {
				200: CreatePubResponseBody,
				404: z.object({ message: z.string() }),
			},
		},
		getPub: {
			method: "GET",
			path: "/:instanceId/pubs/:pubId",
			summary: "Gets a pub",
			description: "A way to get pubs fields for an integration instance",
			pathParams: z.object({
				pubId: z.string(),
				instanceId: z.string(),
			}),
			responses: {
				200: PubValuesResponseBody,
			},
		},
		getAllPubs: {
			method: "GET",
			path: "/:instanceId/pubs",
			summary: "Gets all pubs for this instance",
			description: "A way to get all pubs for an integration instance",
			pathParams: z.object({
				instanceId: z.string(),
			}),
			responses: {
				200: z.array(PubValuesResponseBody),
			},
		},
		updatePub: {
			method: "PATCH",
			path: "/:instanceId/pubs/:pubId",
			summary: "Adds field(s) to a pub",
			description: "A way to update a field for an existing pub",
			body: PubValuesRequestBody,
			pathParams: z.object({
				pubId: z.string(),
				instanceId: z.string(),
			}),
			responses: {
				200: PubValuesResponseBody,
			},
		},
		getSuggestedMembers: {
			method: "GET",
			path: "/:instanceId/autosuggest/members/:memberCandidateString",
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
			path: "/:instanceId/email",
			summary: "Send an email from PubPub to a new or existing PubPub user",
			description:
				"Recipient can be an existing pubpub user identified by ID, or a new user who must be identified by email and name.",
			body: z.object({
				to: z.union([
					z.object({
						userId: z.string(),
					}),
					z.object({
						email: z.string(),
						name: z.string(),
					}),
				]),
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
	},
	{
		pathPrefix: "/integrations",
		baseHeaders: z.object({
			authorization: z.string(),
		}),
	}
);
