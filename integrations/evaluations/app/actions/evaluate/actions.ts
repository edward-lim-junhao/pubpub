"use server";

import { PubValues } from "@pubpub/sdk";
import { revalidatePath } from "next/cache";
import { expect } from "utils";
import {
	sendSubmittedNotificationEmail,
	unscheduleAllDeadlineReminderEmails,
	unscheduleNoSubmitNotificationEmail,
} from "~/lib/emails";
import { getInstanceConfig, getInstanceState, setInstanceState } from "~/lib/instance";
import { client } from "~/lib/pubpub";
import { cookie } from "~/lib/request";
import { assertHasAccepted } from "~/lib/types";

export const submit = async (instanceId: string, submissionPubId: string, values: PubValues) => {
	try {
		const submissionPub = await client.getPub(instanceId, submissionPubId);
		const user = JSON.parse(expect(cookie("user")));
		const instanceConfig = expect(
			await getInstanceConfig(instanceId),
			"Instance not configured"
		);
		const instanceState = (await getInstanceState(instanceId, submissionPubId)) ?? {};
		if (instanceConfig === undefined) {
			return { error: "Instance not configured" };
		}
		let evaluator = expect(
			instanceState[user.id],
			`User was not invited to evaluate pub ${submissionPubId}`
		);
		assertHasAccepted(evaluator);
		const evaluationPub = await client.createPub(instanceId, {
			pubTypeId: instanceConfig.pubTypeId,
			parentId: submissionPubId,
			values: values,
		});
		evaluator = instanceState[user.id] = {
			...evaluator,
			status: "received",
			evaluatedAt: new Date().toString(),
			evaluationPubId: evaluationPub.id,
		};
		await setInstanceState(instanceId, submissionPubId, instanceState);
		// Unschedule no-submit notification email for manager.
		await unscheduleNoSubmitNotificationEmail(instanceId, submissionPubId, evaluator);
		// unschedule dealine reminder emails.
		await unscheduleAllDeadlineReminderEmails(instanceId, submissionPubId, evaluator);
		// Immediately send submitted notification email.
		await sendSubmittedNotificationEmail(
			instanceId,
			instanceConfig,
			submissionPubId,
			evaluator,
			submissionPub.assignee
		);
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		return { error: error.message };
	}
};

export const upload = async (instanceId: string, pubId: string, fileName: string) => {
	try {
		return await client.generateSignedAssetUploadUrl(instanceId, pubId, fileName);
	} catch (error) {
		return { error: error.message };
	}
};
