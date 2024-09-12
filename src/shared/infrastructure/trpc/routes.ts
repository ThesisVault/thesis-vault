import { createCallerFactory, router } from ".";

export const appRouter = router({});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
