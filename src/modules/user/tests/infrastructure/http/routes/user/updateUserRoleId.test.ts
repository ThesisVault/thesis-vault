import { userRouter } from "@/modules/user/src/infrastructure/http/routes/userRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("updateUserRoleIdEndPoint", () => {
	describe("User is authenticated", () => {
		it("should successfully update user roleId when user is authorized", async () => {
			const seededUser = await seedUser({
				roleId: null,
			});
			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.MANAGE_PERMISSION,
				denyPermissions: 0,
			});
			const seededRole = await seedRole({});
			const request = {
				userId: seededUser.id,
				roleId: seededRole.id,
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

			const userId = await caller.updateUserRoleId(request);

			expect(userId).toBe(seededUser.id);
		});

		it("should throw an error if user is unauthorized", async () => {
			const seededUserWithoutPermission = await seedUser({
				allowPermissions: 0,
				denyPermissions: Permissions.MANAGE_PERMISSION,
			});
			const request = {
				userId: faker.string.uuid(),
				roleId: faker.string.uuid(),
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUserWithoutPermission.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.updateUserRoleId(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(
				`User ${seededUserWithoutPermission.id} does not have MANAGE_PERMISSION permission`,
			);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const request = {
				userId: faker.string.uuid(),
				roleId: faker.string.uuid(),
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.updateUserRoleId(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
