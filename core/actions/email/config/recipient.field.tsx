import { defineActionFormFieldServerComponent } from "~/actions/_lib/custom-form-field/defineConfigServerComponent";
import { UserSelectServer } from "~/app/components/UserSelect/UserSelectServer";
import { db } from "~/kysely/database";
import { UsersId } from "~/kysely/types/public/Users";
import { action } from "../action";

const component = defineActionFormFieldServerComponent(
	action,
	"config",
	async ({ pageContext, actionInstance, communityId }) => {
		const community = await db
			.selectFrom("communities")
			.selectAll()
			.where("id", "=", communityId)
			.executeTakeFirstOrThrow();

		const queryParamName = `recipient-${actionInstance.id}`;
		const query = pageContext.searchParams?.[queryParamName] as string | undefined;

		return (
			<UserSelectServer
				fieldName="recipient"
				fieldLabel="Recipient email address"
				community={community}
				value={actionInstance.config?.recipient as UsersId}
				query={query}
				queryParamName={queryParamName}
			/>
		);
	}
);

export default component;
