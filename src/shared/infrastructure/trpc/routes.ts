import { createCallerFactory, router } from ".";
import { userRouter } from "@/modules/user/src/infrastructure/http/routes/userRouter";

export const appRouter = router({
  userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
