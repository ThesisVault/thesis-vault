import { protectedProcedure, router } from "@/shared/infrastructure/trpc";
import { z } from "zod";
import {
  UpdateUserPermissionController
} from "@/modules/user/src/infrastructure/http/controllers/updateUserPermissionController";

export const userRouter = router({
  updateUserPermissions: protectedProcedure.input(z.object({
    userToEditId: z.string(),
    permissions: z.number()
  })).mutation(async ({ input, ctx }) => {
    return new UpdateUserPermissionController().execute({
      ...input,
      editorId: ctx.session.user.id
    });
  })
})
