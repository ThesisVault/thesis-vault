import { DeleteRoleController } from "@/modules/user/src/infrastructure/http/controllers/role/deleteRoleController";
import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import { CreateRoleController } from "../controllers/role/createRoleController";
import { GetRoleByIdController } from "../controllers/role/getRoleByIdController";

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
