import { type DefaultSession, getServerSession } from "next-auth";
import { authConfig } from "./config";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

export const getServerAuthSession = () => getServerSession(authConfig);
