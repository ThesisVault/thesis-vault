import { GetUserAuditLogsByUserIdController } from "@/modules/user/src/infrastructure/http/controllers/userAuditLog/getUserAuditLogsByUserIdController";
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";

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
});
