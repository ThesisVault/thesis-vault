"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { type ReactNode, useState } from "react";
import superjson from "superjson";
import { TRPCUtils } from "../../../../utils/TRPCUtils";
import type { AppRouter } from "../routes";
import { queryClient } from "./queryClient";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					transformer: superjson,
					url: `${TRPCUtils.getBaseURL()}/api/trpc`,
				}),
			],
		}),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient()}>
			<QueryClientProvider client={queryClient()}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
