import { userRouter } from "@/modules/user/src/infrastructure/http/routes/user/userRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import type { TRPCError } from "@trpc/server";

describe("getUsersByPaginationEndPoint", () => {
	describe("User is authenticated", () => {
		it("should successfully return paginated users", async () => {
			const seededUserOne = await seedUser({});
			const seededUserTwo = await seedUser({});
			const seededUserThree = await seedUser({});
			const seededUserFour = await seedUser({});
			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.MANAGE_USER,
			});

			const request = {
				page: 1,
				perPage: 5,
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

			const result = await caller.getUserByPagination(request);

			expect(result.users.length).toBe(5);
			expect(result.totalPages).toBe(1);

			const userIds = result.users.map((user) => user.id);
			expect(userIds).toEqual(
				expect.arrayContaining([
					seededUserOne.id,
					seededUserTwo.id,
					seededUserThree.id,
					seededUserFour.id,
					seededUserWithPermission.id,
				]),
			);

			it("should return an error if user does not have MANAGE_USER permission", async () => {
				const seededUser = await seedUser({
					allowPermissions: 0,
				});

				const request = {
					perPage: 2,
					page: 1,
					requestedById: seededUser.id,
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
					await caller.getUserByPagination(request);
				} catch (error) {
					errorMessage = (error as Error).message;

					expect(error).toBeInstanceOf(ForbiddenError);
				}

				expect(errorMessage).toBe(`User ${seededUser.id} does not have MANAGE_USER permission`);
			});
		});

		describe("User is unauthenticated", () => {
			it("should return an unauthorized error if user is not authenticated", async () => {
				const request = {
					page: 1,
					perPage: 10,
				};

				const createdCaller = createCallerFactory(userRouter);
				const caller = createdCaller({
					session: null,
					db: db,
				});

				let errorMessage = "";
				try {
					await caller.getUserByPagination(request);
				} catch (error) {
					errorMessage = (error as TRPCError).message;
				}

				expect(errorMessage).toBe("UNAUTHORIZED");
			});
		});
	});
});
