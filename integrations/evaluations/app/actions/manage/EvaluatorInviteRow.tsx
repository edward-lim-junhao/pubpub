"use client";

import { SuggestedMembersQuery } from "@pubpub/sdk";
import { memo, useEffect, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Icon,
	Input,
	Textarea,
} from "ui";
import * as z from "zod";
import { EvaluatorSuggestButton } from "./EvaluatorSuggestButton";
import { EmailFormSchema } from "./types";

const pad = (n: number) => (n < 10 ? "0" + n : n);
const daysHoursMinutes = (ms: number) => {
	const msInHour = 60 * 60 * 1000;
	const msInDay = 24 * msInHour;
	let days = Math.floor(ms / msInDay);
	let hours = Math.floor((ms - days * msInDay) / msInHour);
	let minutes = Math.round((ms - days * msInDay - hours * msInHour) / 60000);
	if (minutes === 60) {
		hours++;
		minutes = 0;
	}
	if (hours === 24) {
		days++;
		hours = 0;
	}
	return [days, pad(hours), pad(minutes)].join(":");
};

type Props = {
	control: Control<any>;
	inviteTime: string | undefined;
	index: number;
	onRemove: (index: number) => void;
	onSuggest: (index: number, query: SuggestedMembersQuery) => void;
};

export const EvaluatorInviteRow = memo((props: Props) => {
	const getTimeBeforeInviteSent = () =>
		props.inviteTime ? new Date(props.inviteTime).getTime() - Date.now() : Infinity;
	const [timeBeforeInviteSent, setTimeBeforeInviteSent] = useState(getTimeBeforeInviteSent);
	const invite = useWatch<z.infer<typeof EmailFormSchema>>({
		control: props.control,
		name: `invites.${props.index}`,
	});
	const inviteSent = timeBeforeInviteSent <= 0;
	const inviteHasUser = typeof invite === "object" && "userId" in invite;

	// Update the timer every second.
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (timeBeforeInviteSent > 0) {
			interval = setInterval(() => {
				const timeBeforeInviteSent = getTimeBeforeInviteSent();
				setTimeBeforeInviteSent(timeBeforeInviteSent);
				// Clear the timer when the invite would be sent.
				if (timeBeforeInviteSent <= 0) clearInterval(interval);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [props.inviteTime]);

	return (
		<div className="flex flex-row gap-4 mb-4">
			<FormField
				name={`invites.${props.index}.email`}
				render={({ field }) => (
					<FormItem className="flex-1 self-start">
						<FormControl>
							<Input
								placeholder={
									inviteHasUser
										? "(email hidden)"
										: props.index === 0
										? "e.g. stevie@example.org"
										: ""
								}
								{...field}
								disabled={inviteHasUser}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				name={`invites.${props.index}.firstName`}
				render={({ field }) => (
					<FormItem className="flex-1 self-start">
						<FormControl>
							<Input
								placeholder={props.index === 0 ? "Stevie" : ""}
								{...field}
								disabled={inviteHasUser}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				name={`invites.${props.index}.lastName`}
				render={({ field }) => (
					<FormItem className="flex-1 self-start">
						<FormControl>
							<Input
								placeholder={props.index === 0 ? "Admin" : ""}
								{...field}
								disabled={inviteHasUser}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="shrink-0 basis-36">
				<EvaluatorSuggestButton
					index={props.index}
					disabled={inviteHasUser}
					query={invite as SuggestedMembersQuery}
					onClick={() => props.onSuggest(props.index, invite as SuggestedMembersQuery)}
				/>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="relative" variant="ghost">
							<Icon.Mail className="h-4 w-4" />
							{timeBeforeInviteSent < Infinity && !inviteSent && (
								<span className="absolute top-[100%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[10px] px-1 py-0">
									{daysHoursMinutes(timeBeforeInviteSent)}
								</span>
							)}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Template</DialogTitle>
							{props.inviteTime &&
								(inviteSent ? (
									<DialogDescription>
										This email was sent at{" "}
										<strong className="font-medium">
											{new Date(props.inviteTime).toLocaleString()}
										</strong>
										, and can no longer be edited.
									</DialogDescription>
								) : (
									<DialogDescription>
										This email is scheduled to be sent at{" "}
										<strong className="font-medium">
											{new Date(props.inviteTime).toLocaleString()}
										</strong>
										.
									</DialogDescription>
								))}
						</DialogHeader>
						<div className="flex flex-col justify-between align-baseline gap-4">
							<FormField
								name={`invites.${props.index}.template.subject`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Subject</FormLabel>
										<FormControl>
											<Input {...field} disabled={inviteSent} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name={`invites.${props.index}.template.message`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Message</FormLabel>
										<FormControl className="mt-[8px]">
											<Textarea
												{...field}
												required
												disabled={inviteSent}
												rows={8}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</DialogContent>
				</Dialog>
				<Button variant="ghost" onClick={() => props.onRemove(props.index)}>
					<Icon.X className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
});
