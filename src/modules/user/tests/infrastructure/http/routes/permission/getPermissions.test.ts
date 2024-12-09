import { permissionRouter } from "@/modules/user/src/infrastructure/http/routes/permissionRouter";
import { Permissions, PermissionsDetail } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import type { TRPCError } from "@trpc/server";

describe("getPermissionsEndPoint", () => {
	describe("User is authenticated", () => {
		it("should return the initial list of permissions", async () => {
			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.MANAGE_PERMISSION,
			});

			const createdCaller = createCallerFactory(permissionRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUserWithPermission.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const userId = await caller.getPermissions();
			expect(userId).toBe(PermissionsDetail);
		});

		it("should return an error if the user does not have MANAGE_PERMISSION permission", async () => {
			const seededUserWithPermission = await seedUser({
				allowPermissions: 0,
			});

			const createdCaller = createCallerFactory(permissionRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUserWithPermission.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getPermissions();
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(
				`User ${seededUserWithPermission.id} does not have MANAGE_PERMISSION permission`,
			);
		});
	});

	describe("User is Unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const createdCaller = createCallerFactory(permissionRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getPermissions();
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
