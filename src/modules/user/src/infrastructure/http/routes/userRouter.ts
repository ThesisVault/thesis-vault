import { DeleteUserController } from "@/modules/user/src/infrastructure/http/controllers/user/deleteUserController";
import { UpdateUserPermissionController } from "@/modules/user/src/infrastructure/http/controllers/user/updateUserPermissionController";
import { UpdateUserRoleIdController } from "@/modules/user/src/infrastructure/http/controllers/user/updateUserRoleIdController";
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import { HasPermissionController } from "../controllers/user/hasPermissionController";

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

	updateUserRoleId: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				roleId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return new UpdateUserRoleIdController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),

	deleteUser: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return new DeleteUserController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),

	hasPermission: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				permission: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const hasPermissionController = new HasPermissionController();
			return hasPermissionController.executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});
