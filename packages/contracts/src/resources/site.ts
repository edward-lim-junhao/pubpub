import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { CreatePubRequestBodyWithNulls, CreatePubRequestBodyWithNullsBase } from "./integrations";

// import { pubsSchema } from "db/public/Pubs";
// import { StagesId, stagesIdSchema, stagesSchema } from "db/public/Stages";
// import { pubTypesSchema } from "db/src/public/PubTypes";
type StagesId = string & { __brand: "StagesId" };
const stagesIdSchema = z.string().uuid() as unknown as z.Schema<StagesId>;
const pubsSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
	pubTypeId: z.string().uuid(),
	communityId: z.string().uuid(),
	parentId: z.string().uuid().nullable(),
	assigneeId: z.string().uuid().nullable(),
});

const pubTypesSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const stagesSchema = z.record(z.unknown());

export type CreatePubRequestBodyWithNullsNew = z.infer<typeof CreatePubRequestBodyWithNullsBase> & {
	stageId?: StagesId;
	children?: (Omit<CreatePubRequestBodyWithNulls, "stageId"> & { stageId?: StagesId })[];
};

const CreatePubRequestBodyWithNullsWithStageId = CreatePubRequestBodyWithNullsBase.extend({
	stageId: stagesIdSchema.optional(),
});

export const CreatePubRequestBodyWithNullsNew: z.ZodType<CreatePubRequestBodyWithNullsNew> =
	CreatePubRequestBodyWithNullsWithStageId.extend({
		children: z.lazy(() => CreatePubRequestBodyWithNullsNew.array().optional()),
	});

const contract = initContract();

type PubWithChildren = z.infer<typeof pubsSchema> & {
	children?: PubWithChildren[];
};

const pubWithChildrenSchema: z.ZodType<PubWithChildren> = pubsSchema.extend({
	children: z.lazy(() => z.array(pubWithChildrenSchema).optional()),
});

export const siteApi = contract.router(
	{
		pubs: {
			get: {
				method: "GET",
				path: "/pubs/:pubId",
				summary: "Gets a pub",
				description:
					"Get a pub and its children by ID. This endpoint is used by the PubPub site builder to get a pub's details.",
				pathParams: z.object({
					pubId: z.string().uuid(),
				}),
				responses: {
					200: pubWithChildrenSchema,
				},
			},
			getMany: {
				method: "GET",
				path: "/pubs",
				summary: "Gets a list of pubs",
				description:
					"Get a list of pubs by ID. This endpoint is used by the PubPub site builder to get a list of pubs.",
				query: z.object({
					limit: z.number().default(10).optional(),
					offset: z.number().default(0).optional(),
					orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
					orderDirection: z.enum(["asc", "desc"]).optional(),
				}),
				responses: {
					200: z.array(pubWithChildrenSchema),
				},
			},
			create: {
				method: "POST",
				path: "/pubs",
				summary: "Creates a pub",
				body: CreatePubRequestBodyWithNullsNew,
				responses: {
					201: z.array(pubWithChildrenSchema),
				},
			},
		},
		pubTypes: {
			get: {
				path: "/pub-types/:pubTypeId",
				method: "GET",
				summary: "Gets a pub type",
				description:
					"Get a pub type by ID. This endpoint is used by the PubPub site builder to get a pub type's details.",
				pathParams: z.object({
					pubTypeId: z.string().uuid(),
				}),
				responses: {
					200: pubTypesSchema,
				},
			},
			getMany: {
				path: "/pub-types",
				method: "GET",
				summary: "Gets a list of pub types",
				description:
					"Get a list of pub types by ID. This endpoint is used by the PubPub site builder to get a list of pub types.",
				query: z.object({
					limit: z.number().default(10).optional(),
					offset: z.number().default(0).optional(),
					orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
					orderDirection: z.enum(["asc", "desc"]).optional(),
				}),
				responses: {
					200: pubTypesSchema.array(),
				},
			},
		},
		stages: {
			get: {
				path: "/stages/:stageId",
				method: "GET",
				summary: "Gets a stage",
				description:
					"Get a stage by ID. This endpoint is used by the PubPub site builder to get a stage's details.",
				pathParams: z.object({
					stageId: z.string().uuid(),
				}),
				responses: {
					200: stagesSchema,
				},
			},
			getMany: {
				path: "/stages",
				method: "GET",
				summary: "Gets a list of stages",
				description:
					"Get a list of stages by ID. This endpoint is used by the PubPub site builder to get a list of stages.",
				query: z.object({
					limit: z.number().default(10).optional(),
					offset: z.number().default(0).optional(),
					orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
					orderDirection: z.enum(["asc", "desc"]).optional(),
				}),
				responses: {
					200: stagesSchema.array(),
				},
			},
		},
	},
	{
		pathPrefix: "/site",
		baseHeaders: z.object({
			authorization: z.string().regex(/^Bearer /),
		}),
	}
);
