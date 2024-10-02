import type { Metadata } from "next";

import { notFound } from "next/navigation";

import type { UsersId } from "db/public";
import { AuthTokenType } from "db/public";

import { PubEditorDialog } from "~/app/components/pubs/PubEditor/PubEditorDialog";
import { getPageLoginData } from "~/lib/auth/loginData";
import { findCommunityBySlug } from "~/lib/server/community";
import { setupPathAwareDialogSearchParamCache } from "~/lib/server/pathAwareDialogParams";
import { createToken } from "~/lib/server/token";
import { StageList } from "./components/StageList";

export const metadata: Metadata = {
	title: "Workflows",
};

type Props = {
	params: { communitySlug: string };
	searchParams: Record<string, string | string[] | undefined>;
};

export default async function Page({ params, searchParams }: Props) {
	const [{ user }, community] = await Promise.all([
		getPageLoginData(),
		findCommunityBySlug(params.communitySlug),
	]);

	if (!community) {
		notFound();
	}

	const token = createToken({
		userId: user.id as UsersId,
		type: AuthTokenType.generic,
	});

	setupPathAwareDialogSearchParamCache(searchParams);
	return (
		<>
			<div className="mb-16 flex items-center justify-between">
				<h1 className="text-xl font-bold">Stages</h1>
			</div>
			<StageList
				token={token}
				communityId={community.id}
				pageContext={{
					params,
					searchParams,
				}}
			/>
			<PubEditorDialog searchParams={searchParams} />
		</>
	);
}
