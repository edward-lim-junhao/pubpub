import { Prisma } from "@prisma/client";
import prisma from "@/prisma/db";
import { getLoginData } from "@/lib/auth/loginData";
import SideNav from "./SideNav";

export type CommunityData = Prisma.PromiseReturnType<typeof getCommunity>;

const getCommunity = async (slug: string) => {
	return prisma.community.findUnique({
		where: { slug: slug },
	});
};

const getAvailableCommunities = async () => {
	const loginData = await getLoginData();
	return prisma.community.findMany({
		where: { members: { some: { userId: loginData?.id } } },
	});
};

type Props = { children: React.ReactNode; params: { communitySlug: string } };

export default async function MainLayout({ children, params }: Props) {
	const community = await getCommunity(params.communitySlug);
	if (!community) {
		return null;
	}
	const availableCommunities = await getAvailableCommunities();
	return (
		<div className="flex min-h-screen">
			<SideNav community={community} availableCommunities={availableCommunities} />
			<div className="flex-auto py-4 px-12 ml-64">{children}</div>
		</div>
	);
}
