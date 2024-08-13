import { Toaster } from "ui/toaster";

import "ui/styles.css";

import { PublicEnvScript } from "next-runtime-env";

import InitClient from "./InitClient";

import "./globals.css";

import { TooltipProvider } from "ui/tooltip";

export const metadata = {
	title: "PubPub Platform",
	description: "A more flexible PubPub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<PublicEnvScript />
			</head>
			<body>
				{/* Can be removed once we have moved to Lucia */}
				<InitClient />
				<TooltipProvider>
					{children}
					<Toaster />
				</TooltipProvider>
			</body>
		</html>
	);
}
