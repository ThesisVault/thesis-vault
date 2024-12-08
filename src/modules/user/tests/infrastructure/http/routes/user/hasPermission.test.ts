import { userRouter } from "@/modules/user/src/infrastructure/http/routes/userRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("hasPermissionEndpoint", () => {
	describe("Authenticated User", () => {
		it("should return true when the user has the required permission", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({ roleId: seededRole.id });

			const request = {
				userId: seededUser.id,
				permission: seededRole.permissions,
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: request.userId,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const hasPermission = await caller.hasPermissionByUserId(request);
			expect(hasPermission).toBe(true);
		});
	});

	describe("Unauthenticated User", () => {
		it("should return an unauthorized error if the user is not authenticated", async () => {
			const request = {
				userId: faker.string.uuid(),
				permission: Permissions.MANAGE_PERMISSION,
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.hasPermissionByUserId(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
