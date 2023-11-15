import prisma from "~/prisma/db";

export async function setIntegrationInstanceConfig(instanceId: string, config: object) {
	return await prisma.integrationInstance.update({
		where: {
			id: instanceId,
		},
		data: {
			config,
		},
	});
}

export const getIntegrationInstanceConfig = async (instanceId: string) => {
	const instance = await prisma.integrationInstance.findFirst({
		where: {
			id: instanceId,
		},
		select: {
			config: true,
		},
	});
	return instance?.config ?? null;
};

export const setIntegrationInstanceState = async (instanceId: string, pubId: string, state) => {
	return await prisma.integrationInstanceState.upsert({
		where: {
			pub_instance: {
				instanceId,
				pubId,
			},
		},
		update: {
			state,
		},
		create: {
			instanceId,
			pubId,
			state,
		},
	});
};

export const getIntegrationInstanceState = async (instanceId: string, pubId: string) => {
	const state = await prisma.integrationInstanceState.findUnique({
		where: {
			pub_instance: {
				instanceId,
				pubId,
			},
		},
		select: {
			state: true,
		},
	});
	return state?.state ?? null;
};
