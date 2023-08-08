import prisma from "prisma/db";
import { NextResponse, NextRequest } from "next/server";

const getPubFields = async (pub_id: string) => {
	const fields = await prisma.pubValue.findMany({
		where: { pubId: pub_id },
		distinct: ["fieldId"],
		orderBy: {
			createdAt: "desc",
		},
		include: {
			field: {
				select: {
					name: true,
				},
			},
		},
	});

	return fields.reduce((prev: any, curr) => {
		prev[curr.field.name] = curr.value;
		return prev;
	}, {});
};

/**
 * @swagger
 * /api/v7/integrations/{instanceId}/pubs/{pubId}:
 *   get:
 *     description: Returns an Pub by ID and its Instance ID
 *     responses:
 *       200:
 *         description: A pub
 *       400:
 *          Invalid ID
 *       404:
 *          Pub not found
 */
export async function GET(request: NextRequest, { params }: { params: { pub_id: string } }) {
	const pub = await getPubFields(params.pub_id);
	return NextResponse.json(pub);
}

/**
 * @swagger
 * /api/v7/integrations/{instanceId}/pubs/{pubId}:
 *   put:
 *     description: Updates a Pub by ID and its Instance ID
 *     responses:
 *       200:
 *         description: A Pub with its updated fields
 *       400:
 *          Invalid ID
 *       404:
 *          Pub not found
 */
export async function PUT(request: NextRequest, { params }: { params: { pub_id: string } }) {
	const { fields } = await request.json();

	const fieldNames = Object.keys(fields);

	const fieldIds = await prisma.pubField.findMany({
		where: {
			name: {
				in: fieldNames,
			},
		},
		select: {
			id: true,
			name: true,
		},
	});

	const newValues = fieldIds.map((field) => {
		return {
			fieldId: field.id,
			value: fields[field.name],
		};
	});

	await prisma.pub.update({
		where: { id: params.pub_id },
		include: {
			values: true,
		},
		data: {
			values: {
				createMany: {
					data: newValues,
				},
			},
		},
	});

	//TODO: we shouldn't query the db twice for this
	const updatedFields = await getPubFields(params.pub_id);

	return NextResponse.json(updatedFields);
}
