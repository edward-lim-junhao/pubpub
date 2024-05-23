// shared actions between server and client

import type Event from "~/kysely/types/public/Event";
import * as email from "../email/action";
import * as log from "../log/action";
import * as move from "../move/action";
import * as pdf from "../pdf/action";
import * as pushToV6 from "../pushToV6/action";

export const actions = {
	[log.action.name]: log.action,
	[pdf.action.name]: pdf.action,
	[email.action.name]: email.action,
	[pushToV6.action.name]: pushToV6.action,
	[move.action.name]: move.action,
} as const;

export const getActionByName = (name: keyof typeof actions) => {
	return actions[name];
};

export const getActionNames = () => {
	return Object.keys(actions) as (keyof typeof actions)[];
};

const humanReadableEvents: Record<Event, string> = {
	pubEnteredStage: "a pub enters this stage",
	pubLeftStage: "a pub leaves this stage",
	pubInStageForDuration: "a pub stays in this stage for a duration",
};

export const humanReadableEvent = (event: Event) => humanReadableEvents[event];

export const serializeRule = (event: Event, instanceName: string) =>
	`${instanceName} will run when ${humanReadableEvent(event)}`;
