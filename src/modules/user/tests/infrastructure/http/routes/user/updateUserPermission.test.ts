import { userRouter } from "@/modules/user/src/infrastructure/http/routes/userRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import type { TRPCError } from "@trpc/server";
import { v4 as uuid } from "uuid";

describe("updateUserPermissionEndPoint", () => {
	describe("User is authenticated", () => {
		it("should successfully update user permission and return user id", async () => {
			const seededUser = await seedUser({
				allowPermissions: 0,
				denyPermissions: 0,
			});
			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.MANAGE_PERMISSION,
			});
			const request = {
				userId: seededUser.id,
				allowPermission: Permissions.UPLOAD_THESIS,
				denyPermission: Permissions.MANAGE_PERMISSION,
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUserWithPermission.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const userId = await caller.updateUserPermissions(request);

			expect(userId).toBe(seededUser.id);
		});

		it("should return an error if user does not have MANAGE_USER permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: 0,
			});
			const request = {
				userId: uuid(),
				allowPermission: 0,
				denyPermission: 0,
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUser.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.updateUserPermissions(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(`User ${seededUser.id} does not have MANAGE_PERMISSION permission`);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const request = {
				userId: uuid(),
				allowPermission: 0,
				denyPermission: 0,
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.updateUserPermissions(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
