import Link from "next/link";

import { Button } from "ui/button";

import type { CommunitiesId } from "~/kysely/types/public/Communities";
import { PubCreateButton } from "~/app/components/PubCRUD/PubCreateButton";

type Props = {
	communityId: CommunitiesId;
};

const PubHeader: React.FC<Props> = ({ communityId }) => {
	return (
		<div className="mb-16 flex items-center justify-between">
			<h1 className="flex-grow text-xl font-bold">Pubs</h1>
			<div className="flex items-center gap-x-2">
				<PubCreateButton communityId={communityId} />
				<Button variant="outline" size="sm" asChild>
					<Link href="types">Manage Types</Link>
				</Button>
			</div>
		</div>
	);
};
export default PubHeader;
