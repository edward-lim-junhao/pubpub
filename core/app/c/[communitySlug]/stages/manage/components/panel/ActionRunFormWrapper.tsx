import type { StagePub } from "./queries";
import type { ActionInstances } from "~/kysely/types/public/ActionInstances";
import type { CommunitiesId } from "~/kysely/types/public/Communities";
import type { PubsId } from "~/kysely/types/public/Pubs";
import type { Stages } from "~/kysely/types/public/Stages";
import { resolveFieldConfig } from "~/actions/_lib/custom-form-field/resolveFieldConfig";
import { Action, ActionInstanceOf } from "~/actions/types";
import { ActionRunForm } from "./ActionRunForm";
import { PageContext } from "./StagePanelPubsRunActionDropDownMenu";

export const ActionRunFormWrapper = async ({
	actionInstance,
	pub,
	stage,
	pageContext,
}: {
	actionInstance: ActionInstances;
	pub: StagePub;
	stage: Stages;
	pageContext: PageContext;
}) => {
	const resolvedFieldConfig = await resolveFieldConfig(actionInstance.action, "params", {
		pubId: pub.id as PubsId,
		stageId: stage.id,
		communityId: pub.communityId as CommunitiesId,
		actionInstance: actionInstance as ActionInstanceOf<Action>,
		pageContext,
	});

	return (
		<ActionRunForm
			actionInstance={actionInstance}
			pub={pub}
			fieldConfig={resolvedFieldConfig}
		/>
	);
};
