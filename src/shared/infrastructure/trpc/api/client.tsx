"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { type ReactNode, useState } from "react";
import superjson from "superjson";
import { TRPCUtils } from "../../../../utils/TRPCUtils";
import type { AppRouter } from "../routes";
import { queryClient } from "./queryClient";

export const api = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				httpBatchLink({
					transformer: superjson,
					url: `${TRPCUtils.getBaseURL()}/api/trpc`,
				}),
			],
		}),
	);

	return (
		<api.Provider client={trpcClient} queryClient={queryClient()}>
			<QueryClientProvider client={queryClient()}>{children}</QueryClientProvider>
		</api.Provider>
	);
}
