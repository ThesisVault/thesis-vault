import { GetUserAuditLogsByUserIdController } from "@/modules/user/src/infrastructure/http/controllers/userAuditLog/getUserAuditLogsByUserIdController";
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import { GetUserAuditLogsWithPaginationController } from "../controllers/userAuditLog/getUserAuditLogsWithPaginationController";

export const userAuditLogRouter = router({
	getUserAuditLogsByUserId: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new GetUserAuditLogsByUserIdController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),

	getUserAuditLogsWithPagination: protectedProcedure
		.input(
			z.object({
				perPage: z.number(),
				page: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new GetUserAuditLogsWithPaginationController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});
