"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
} from "ui/alert-dialog";
import { Button } from "ui/button";
import { Trash } from "ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ui/tooltip";
import { toast } from "ui/use-toast";

import { didSucceed, useServerAction } from "~/lib/serverActions";
import { removeCommunity } from "./actions";
import { TableCommunity } from "./getCommunityTableColumns";

export const RemoveCommunityButton = ({
	community,
	user,
}: {
	community: TableCommunity;
	user: any;
}) => {
	const runRemoveCommunity = useServerAction(removeCommunity);
	return (
		<AlertDialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipContent>
						<span>Remove Community</span>
					</TooltipContent>
					<TooltipTrigger asChild>
						<AlertDialogTrigger asChild>
							<Button variant="ghost">
								Remove community <Trash size="14" className="ml-2" />
							</Button>
						</AlertDialogTrigger>
					</TooltipTrigger>
				</Tooltip>
			</TooltipProvider>
			<AlertDialogContent>
				<AlertDialogHeader>Remove Member</AlertDialogHeader>
				<p>
					Are you sure you want to delete the community <strong>{community.name}?</strong>{" "}
					All stages and pubs associated with this community will be deleted.
				</p>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button asChild variant="destructive">
						<AlertDialogAction
							onClick={async () => {
								const response = await runRemoveCommunity({ user, community });
								if (didSucceed(response)) {
									toast({
										title: "Success",
										description: "Community successfully removed",
										variant: "default",
									});
								}
							}}
						>
							<Trash size="16" className="mr-2" />
							Remove
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};