import {
  UpdateUserRoleIdController
} from "@/modules/user/src/infrastructure/http/controllers/user/updateUserRoleIdController";
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import {
  UpdateUserPermissionController
} from "@/modules/user/src/infrastructure/http/controllers/user/updateUserPermissionController";

export const userRouter = router({
	updateUserPermissions: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				allowPermission: z.number(),
				denyPermission: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return new UpdateUserPermissionController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});
