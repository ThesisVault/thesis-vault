import NextAuth from "next-auth";
import { authConfig } from "@/shared/infrastructure/authentication/config";

const nextAuth = NextAuth(authConfig);
export const { GET, POST } = nextAuth.handlers;

export default nextAuth;