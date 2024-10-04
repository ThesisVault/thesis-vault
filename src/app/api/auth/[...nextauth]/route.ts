import NextAuth from "next-auth";
import { authConfig } from "@/shared/infrastructure/authentication/config";

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
