"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Button } from "ui";
import PubRow from "~/app/components/PubRow";
import { getPubUsers } from "~/lib/permissions";
import { StagePayload, UserLoginData } from "~/lib/types";
import { StagePubActions } from "./StagePubActions";

type Props = { stages: StagePayload[]; token: string; loginData: UserLoginData };
type IntegrationAction = { text: string; href: string; kind?: "stage" };

const StageList: React.FC<Props> = function ({ stages, token, loginData }) {
	return (
		<div>
			{stages.map((stage) => {
				const users = getPubUsers(stage.permissions);
				const sources = stage.moveConstraintSources.map(
					(stage) => stages.find((s) => s.id === stage.stageId)!
				);
				const destinations = stage.moveConstraints.map((stage) => stage.destination);
				return (
					<div key={stage.id} className="mb-20">
						<div className="flex flex-row justify-between">
							<h3 className="font-semibold text-lg mb-2">{stage.name}</h3>
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
													href.searchParams.set(
														"instanceId",
														instance.id
													);
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
						</div>
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
												moveTo={destinations}
												moveFrom={sources}
											/>
										}
									/>
									{index < list.length - 1 && <hr />}
								</Fragment>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
export default StageList;
