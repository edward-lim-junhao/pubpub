"use client";

import type { Pub } from "@prisma/client";
import type { ZodObject } from "zod";

import { useCallback, useTransition } from "react";

import { logger } from "logger";
import AutoForm, { AutoFormSubmit } from "ui/auto-form";
import { Button } from "ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "ui/dialog";
import { TokenProvider } from "ui/tokens";
import { toast } from "ui/use-toast";

import type { ActionInstances, ActionInstancesId } from "~/kysely/types/public/ActionInstances";
import type { PubsId } from "~/kysely/types/public/Pubs";
import { getActionByName } from "~/actions/api";
import { runActionInstance } from "~/actions/api/serverAction";
import { useServerAction } from "~/lib/serverActions";

export const StagePanelPubsRunActionButton = ({
	actionInstance,
	pub,
}: {
	actionInstance: ActionInstances;
	pub: Pub;
}) => {
	const runAction = useServerAction(runActionInstance);

	const [isPending, startTransition] = useTransition();

	const action = getActionByName(actionInstance.action);

	if (!action) {
		logger.info(`Invalid action name ${actionInstance.action}`);
		return null;
	}

	const onSubmit = useCallback(
		async (values) => {
			startTransition(async () => {
				const result = await runAction({
					actionInstanceId: actionInstance.id as ActionInstancesId,
					pubId: pub.id as PubsId,
					actionInstanceArgs: values,
				});

				if ("success" in result) {
					toast({
						title: "Action ran successfully!",
						variant: "default",
						description: result.report,
					});
				}
			});
		},
		[runAction, actionInstance.id, pub.id]
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="flex w-full items-center justify-start gap-x-4 px-4 py-2"
				>
					<action.icon size="14" className="flex-shrink-0" />
					<span className="overflow-auto text-ellipsis">
						{actionInstance.name || action.name}
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{actionInstance.name || action.name}</DialogTitle>
				</DialogHeader>
				<TokenProvider tokens={action.tokens ?? {}}>
					<AutoForm formSchema={action.params as ZodObject<{}>} onSubmit={onSubmit}>
						<AutoFormSubmit disabled={isPending}>Run</AutoFormSubmit>
					</AutoForm>
				</TokenProvider>
			</DialogContent>
		</Dialog>
	);
};
