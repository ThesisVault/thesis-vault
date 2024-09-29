import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createTRPCContext } from "..";
import { type AppRouter, createCaller } from "../routes";
import { queryClient } from "./queryClient";

const getQueryClient = cache(queryClient);

const caller = createCaller(cache(() => createTRPCContext()));

export const { trpc: api } = createHydrationHelpers<AppRouter>(caller, getQueryClient);
