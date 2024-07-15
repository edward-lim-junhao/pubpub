import { notFound } from "next/navigation";

import { FormInput } from "ui/icon";
import { PubFieldProvider } from "ui/pubFields";
import { cn } from "utils";

import { ContentLayout } from "~/app/c/[communitySlug]/ContentLayout";
import { getLoginData } from "~/lib/auth/loginData";
import { getPubFields } from "~/lib/server/pubFields";
import { FieldsTable } from "./FieldsTable";
import { NewFieldButton } from "./NewFieldButton";

type Props = { params: { communitySlug: string } };

const EmptyState = ({ className }: { className?: string }) => {
	return (
		<div className={cn("flex h-full items-center justify-center", className)}>
			<div className="flex max-w-[444px] flex-col items-center justify-center text-foreground">
				<h2 className="mb-2 text-lg font-semibold">You don’t have any fields yet</h2>
				<p className="mb-6 text-center text-sm">
					Fields are reusable data formats that are used to define types.
				</p>
				<NewFieldButton />
			</div>
		</div>
	);
};

export default async function Page({ params }: Props) {
	const loginData = await getLoginData();
	if (!loginData) {
		return notFound();
	}

	const pubFields = await getPubFields().executeTakeFirst();

	if (!pubFields || !pubFields.fields) {
		return null;
	}

	const hasFields = !!Object.keys(pubFields.fields).length;

	return (
		<PubFieldProvider pubFields={pubFields.fields}>
			<ContentLayout
				title={
					<>
						<FormInput size={24} strokeWidth={1} className="mr-2 text-slate-500" />{" "}
						Fields
					</>
				}
				headingAction={<NewFieldButton />}
			>
				<div className="m-4">
					<FieldsTable fields={pubFields.fields} />
					{!hasFields ? <EmptyState className="mt-12" /> : null}
				</div>
			</ContentLayout>
		</PubFieldProvider>
	);
}
