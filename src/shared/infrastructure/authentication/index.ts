import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, getServerSession } from "next-auth";
import { db } from "../database";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

export const getServerAuthSession = () => getServerSession({
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
	adapter: PrismaAdapter(db),
	providers: [],
	session: {
		maxAge: 30 * 24 * 60 * 60, // 1 month
	},
});
