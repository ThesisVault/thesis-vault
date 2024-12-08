import { DeleteUserController } from "@/modules/user/src/infrastructure/http/controllers/user/deleteUserController";
import { GetUsersByPaginationController } from "@/modules/user/src/infrastructure/http/controllers/user/getUsersByPaginationController";
import { HasPermissionByUserIdController } from "@/modules/user/src/infrastructure/http/controllers/user/hasPermissionByUserIdController";
import { UpdateUserPermissionController } from "@/modules/user/src/infrastructure/http/controllers/user/updateUserPermissionController";
import { UpdateUserRoleIdController } from "@/modules/user/src/infrastructure/http/controllers/user/updateUserRoleIdController";
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";

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

	getUserByPagination: protectedProcedure
		.input(
			z.object({
				page: z.number(),
				perPage: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new GetUsersByPaginationController().executeImpl({
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

	hasPermissionByUserId: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				permission: z.number(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new HasPermissionByUserIdController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});
