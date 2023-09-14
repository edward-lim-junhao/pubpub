"use client";
import Link from "next/link";
import { Fragment } from "react";
import { Button, Card, CardContent } from "ui";
import PubRow from "../pubs/PubRow";
import { StagePubActions } from "./StagePubActions";
import { getPubUsers, getStageMoveConstraints } from "~/lib/permissions";
import { StagePayload, User, StagePayloadMoveConstraintDestination } from "~/lib/types";

type Props = { stages: StagePayload[]; token: string; loginData: User };
type IntegrationAction = { text: string; href: string; kind?: "stage" };

const StageList: React.FC<Props> = function ({ stages, token, loginData }) {
	return (
		<div>
			{stages.map((stage) => {
				const users = getPubUsers(stage.permissions);
				const moveStages: StagePayloadMoveConstraintDestination[] = getStageMoveConstraints(
					stage.moveConstraints
				);

				return (
					<div key={stage.id} className="mb-20">
						<h3 className="font-bold text-lg mb-2">{stage.name}</h3>
						{stage.integrationInstances.map((instance) => {
							if (!Array.isArray(instance.integration.actions)) {
								return null;
							}
							return (
								<Fragment key={instance.id}>
									{instance.integration.actions?.map(
										(action: IntegrationAction) => {
											if (action.kind === "stage") {
												const href = new URL(action.href);
												href.searchParams.set("instanceId", instance.id);
												href.searchParams.set("token", token);
												return (
													<Button
														key={action.text}
														variant="outline"
														size="sm"
														asChild
													>
														<Link href={href.toString()}>
															{action.text}
														</Link>
													</Button>
												);
											}
										}
									)}
								</Fragment>
							);
						})}
						<Card>
							<CardContent className="pt-4">
								{stage.pubs.map((pub, index, list) => {
									return (
										<Fragment key={pub.id}>
											<PubRow
												key={pub.id}
												pub={pub}
												token={token}
												actions={
													<StagePubActions
														key={stage.id}
														pub={pub}
														stage={stage}
														users={users}
														loginData={loginData}
														stages={moveStages}
													/>
												}
											/>
											{index < list.length - 1 && <hr />}
										</Fragment>
									);
								})}
							</CardContent>
						</Card>
					</div>
				);
			})}
		</div>
	);
};
export default StageList;
