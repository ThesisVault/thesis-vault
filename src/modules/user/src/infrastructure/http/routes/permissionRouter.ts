import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { GetPermissionsController } from "../controllers/permission/getPermissionsController";

export const permissionRouter = router({
	getPermissions: protectedProcedure.query(async ({ ctx }) => {
		return new GetPermissionsController().executeImpl({
			requestedById: ctx.session.user.id,
		});
	}),
});
