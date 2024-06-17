import { SendEmailRequestBody } from "contracts";

import { IntegrationClient } from "../clients";
import { defineJob } from "../defineJob";
import { InstanceJobPayload } from "../types";

export const sendEmail = defineJob(
	async (
		client: IntegrationClient,
		payload: InstanceJobPayload<SendEmailRequestBody>,
		logger,
		job
	) => {
		const { instanceId, body } = payload;
		logger.info({ msg: `Sending email` });
		const info = await client.sendEmail(instanceId, body);
		logger.info({ msg: `Sent email`, info });
	}
);
