import { redirect } from "next/navigation";
import { getLoginData } from "~/lib/auth/loginData";
import prisma from "~/prisma/db";
import { logger } from "logger";

export default async function Page() {
	const loginData = await getLoginData();

	// if user and no commuhnmitiy, redirect to settings
	if (loginData) {
		let user;
		try {
			user = await prisma.user.findUnique({
				where: { email: loginData.email },
			});

			const member = await prisma.member.findFirst({
				where: { userId: user.id },
				include: { community: true },
			});

			if (member) {
				redirect(`/c/${member.community.slug}/stages`);
			} else {
				redirect("/settings");
			}
		} catch {
			redirect("/login");
		}
	} else {
		redirect("/login");
	}
	return <>Home...</>;
}
