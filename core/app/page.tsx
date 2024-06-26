import { redirect } from "next/navigation";

import { getLoginData } from "~/lib/auth/loginData";
import prisma from "~/prisma/db";

export default async function Page() {
	const loginData = await getLoginData();

	// if user and no commuhnmitiy, redirect to settings
	if (loginData) {
		let user;
		try {
			user = await prisma.user.findUnique({
				where: { email: loginData.email },
			});
		} catch (e) {
			redirect("/login");
		}

		const member = await prisma.member.findFirst({
			where: { userId: user.id },
			include: { community: true },
		});

		if (member) {
			redirect(`/c/${member.community.slug}/stages`);
		} else {
			redirect("/settings");
		}
	} else {
		redirect("/login");
	}
}
