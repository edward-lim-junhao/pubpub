import type { StagePub } from "./queries";
import type { ActionInstances, ActionInstancesId } from "~/kysely/types/public/ActionInstances";
import type { CommunitiesId } from "~/kysely/types/public/Communities";
import type { PubsId } from "~/kysely/types/public/Pubs";
import type { Stages } from "~/kysely/types/public/Stages";
import { resolveFieldConfig } from "~/actions/_lib/custom-form-field/resolveFieldConfig";
import { ActionRunForm } from "./ActionRunForm";

export const ActionRunFormWrapper = async ({
	actionInstance,
	pub,
	stage,
}: {
	actionInstance: ActionInstances;
	pub: StagePub;
	stage: Stages;
}) => {
	const resolvedFieldConfig = await resolveFieldConfig(actionInstance.action, "params", {
		pubId: pub.id as PubsId,
		stageId: stage.id,
		communityId: pub.communityId as CommunitiesId,
		actionInstance: actionInstance,
	});

	return (
		<ActionRunForm
			actionInstance={actionInstance}
			pub={pub}
			fieldConfig={resolvedFieldConfig}
		/>
	);
};