import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import { GetRoleByIdController } from "../../controllers/role/getRoleByIdController";

export const roleRouter = router({
	getRoleById: protectedProcedure
		.input(
			z.object({
				roleId: z.string(),
				name: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new GetRoleByIdController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});
