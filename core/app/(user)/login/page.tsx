import Link from "next/link";
import LoginForm from "./LoginForm";
import { getLoginData } from "~/lib/auth/loginData";
import { redirect } from "next/navigation";
import prisma from "~/prisma/db";
import { logger } from "logger";

export default async function Login() {
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
			logger.warn("Not able to redirect user");
		}
	}
	return (
		<div className="max-w-sm mx-auto">
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
