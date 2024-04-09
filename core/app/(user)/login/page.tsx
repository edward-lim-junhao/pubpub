import Link from "next/link";
import { redirect } from "next/navigation";

import { getLoginData } from "~/lib/auth/loginData";
import prisma from "~/prisma/db";
import LoginForm from "./LoginForm";

export default async function Login() {
	const loginData = await getLoginData();
	// if user and no commuhnmitiy, redirect to settings
	if (loginData?.id) {
		const member = await prisma.member.findFirst({
			where: { userId: loginData.id },
			include: { community: true },
		});

		if (member) {
			redirect(`/c/${member.community.slug}/stages`);
		} else {
			redirect("/settings");
		}
	}
	return (
		<div className="mx-auto max-w-sm">
			<LoginForm />

			{/* <div className="text-gray-600 text-center mt-6">
				Don't have an account?{" "}
				<Link
					href="/signup"
					className="text-black hover:underline transition duration-150 ease-in-out"
				>
					Sign up
				</Link>
			</div> */}
		</div>
	);
}
