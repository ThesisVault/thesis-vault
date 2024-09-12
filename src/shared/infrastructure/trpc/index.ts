import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "../authentication";
import { db } from "../database";

export const createTRPCContext = async () => {
	const session = await getServerAuthSession();

	return { db, session };
};

const trpc = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createCallerFactory = trpc.createCallerFactory;

export const router = trpc.router;

export const publicProcedure = trpc.procedure.use(async ({ next }) => {
	const result = await next();
	return result;
});

export const protectedProcedure = trpc.procedure.use(({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
});
