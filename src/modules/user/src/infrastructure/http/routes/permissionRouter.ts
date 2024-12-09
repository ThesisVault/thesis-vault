import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import { GetPermissionsController } from "../controllers/permission/getPermissionsController";

export const permissionRouter = router({
	getPermissions: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new GetPermissionsController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});