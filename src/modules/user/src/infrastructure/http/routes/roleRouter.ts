import { DeleteRoleController } from "@/modules/user/src/infrastructure/http/controllers/role/deleteRoleController";
import { UpdateRoleController } from "@/modules/user/src/infrastructure/http/controllers/role/updateRoleController"; // Import the UpdateRoleController
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import { CreateRoleController } from "../controllers/role/createRoleController";
import { CreateRoleController } from "../controllers/role/createRoleController";
import { GetRoleByIdController } from "../controllers/role/getRoleByIdController";
import { GetRolesController } from "../controllers/role/getRolesController";

export const roleRouter = router({
	getRoleById: protectedProcedure
		.input(
			z.object({
				roleId: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return new GetRoleByIdController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),

	getRoles: protectedProcedure.query(async ({ ctx }) => {
		return new GetRolesController().executeImpl({
			requestedById: ctx.session.user.id,
		});
	}),

	deleteRole: protectedProcedure
		.input(
			z.object({
				roleId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return new DeleteRoleController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),

	updateRole: protectedProcedure
		.input(
			z.object({
				roleId: z.string(),
				name: z.string(),
				permissions: z.number(),
				color: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return new UpdateRoleController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
	createRole: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				permissions: z.number(),
				color: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return new CreateRoleController().executeImpl({
				...input,
				requestedById: ctx.session.user.id,
			});
		}),
});
