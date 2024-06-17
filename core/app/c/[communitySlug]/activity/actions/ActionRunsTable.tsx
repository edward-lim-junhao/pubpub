"use client";

import * as React from "react";

import { DataTable } from "~/app/components/DataTable";
import { ActionRun, getActionRunsTableColumns } from "./getActionRunsTableColumns";

export const ActionRunsTable = ({ actionRuns }: { actionRuns: ActionRun[] }) => {
	const actionRunsColumns = getActionRunsTableColumns();
	return <DataTable columns={actionRunsColumns} data={actionRuns} />;
};
