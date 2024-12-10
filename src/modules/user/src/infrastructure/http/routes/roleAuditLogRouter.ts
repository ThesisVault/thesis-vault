import { GetRoleAuditLogsByPaginationController } from "@/modules/user/src/infrastructure/http/controllers/roleAuditLog/getRoleAuditLogsByPaginationController";
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";

export const roleAuditLogRouter = router({
	getRoleAuditLogsByPagination: protectedProcedure
		.input(
			z.object({
				perPage: z.number(),
				page: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new GetRoleAuditLogsByPaginationController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});
