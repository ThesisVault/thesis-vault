import { createCallerFactory, router } from ".";

export const appRouter = router({
	// add router here
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
