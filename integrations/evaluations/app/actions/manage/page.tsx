import { notFound, redirect } from "next/navigation";
import { getInstanceConfig, getInstanceState } from "~/lib/instance";
import { client } from "~/lib/pubpub";
import { EvaluatorInviteForm } from "./EvaluatorInviteForm";
import { hasInvite } from "~/lib/types";

type Props = {
	searchParams: {
		instanceId: string;
		pubId: string;
	};
};

export default async function Page(props: Props) {
	const { instanceId, pubId } = props.searchParams;
	if (!(instanceId && pubId)) {
		notFound();
	}
	const instanceConfig = await getInstanceConfig(instanceId);
	if (instanceConfig === undefined) {
		redirect(`/configure?instanceId=${instanceId}&pubId=${pubId}&action=manage`);
	}
	const instanceState = (await getInstanceState(instanceId, pubId)) ?? {};
	const pub = await client.getPub(instanceId, pubId);
	const evaluators = Object.values(instanceState).sort((a, b) => {
		if (hasInvite(a) && !hasInvite(b)) return -1;
		if (hasInvite(b) && !hasInvite(a)) return 1;
		if (!(hasInvite(a) && hasInvite(b))) return 0;
		return new Date(a.invitedAt).getTime() - new Date(b.invitedAt).getTime();
	});
	return (
		<EvaluatorInviteForm
			instanceId={instanceId}
			instanceConfig={instanceConfig}
			evaluators={evaluators}
			pub={pub}
		/>
	);
}
