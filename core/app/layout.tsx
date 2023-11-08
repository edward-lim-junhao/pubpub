import { Inter } from "next/font/google";
import { Toaster } from "ui";
import "ui/styles.css";
import { getLoginData } from "~/lib/auth/loginData";
import InitClient from "./InitClient";
import "./css/globals.css";
import Footer from "./footer";
import Header from "./header";

export const metadata = {
	title: "PubPub v7 Mockup Demo",
	description: "Just a demo to show the models and structure.",
};

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const loginData = await getLoginData();
	return (
		<html lang="en">
			<body
				className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}
			>
				<div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
					<InitClient />
					{!loginData && <Header />}
					{children}
					{!loginData && <Footer />}
					<Toaster />
				</div>
			</body>
		</html>
	);
}
