import type { DeleteUserDTO } from "@/modules/user/src/dtos/userDTO";
import { userRouter } from "@/modules/user/src/infrastructure/http/routes/userRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("deleteUserEndpoint", () => {
	describe("User is authenticated", () => {
		it("should successfully delete user when user is authorized", async () => {
			const seededUser = await seedUser({});
			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.DELETE_USER,
				denyPermissions: 0,
			});
			const request: DeleteUserDTO = {
				userId: seededUser.id,
				requestedById: seededUserWithPermission.id,
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

			const userId = await caller.deleteUser(request);

			expect(userId).toBe(seededUser.id);
		});

		it("should throw an error if user is unauthorized", async () => {
			const seededUserWithoutPermission = await seedUser({
				allowPermissions: 0,
				denyPermissions: Permissions.DELETE_USER,
			});
			const request: DeleteUserDTO = {
				userId: faker.string.uuid(),
				requestedById: seededUserWithoutPermission.id,
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
				await caller.deleteUser(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(
				`User ${request.requestedById} does not have DELETE_USER permission`,
			);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const request = {
				userId: faker.string.uuid(),
				requestedById: faker.string.uuid(),
			};

			const createdCaller = createCallerFactory(userRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.deleteUser(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
