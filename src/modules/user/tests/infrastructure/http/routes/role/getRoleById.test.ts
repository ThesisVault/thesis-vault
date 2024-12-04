import { roleRouter } from "@/modules/user/src/infrastructure/http/routes/role/roleRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("getRoleByIdEndPoint", () => {
	describe("User is authenticated", () => {
		it("should successfully fetch role details when user is authorized", async () => {
			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.MANAGE_ROLE,
				denyPermissions: 0,
			});
			const seededRole = await seedRole({});
			const request = {
				roleId: seededRole.id,
				name: seededRole.name,
			};

			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUserWithPermission.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const roleDetails = await caller.getRoleById(request);

			expect(roleDetails).toBeDefined();
			expect(roleDetails).toBe(seededRole.name);
		});

		it("should throw an error if user is unauthorized", async () => {
			const seededRole = await seedRole({});
			const seededUserWithoutPermission = await seedUser({
				allowPermissions: 0,
				denyPermissions: Permissions.MANAGE_ROLE,
			});
			const request = {
				roleId: faker.string.uuid(),
				name: seededRole.name,
			};

			const createdCaller = createCallerFactory(roleRouter);
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
				await caller.getRoleById(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(
				`User ${seededUserWithoutPermission.id} does not have MANAGE_ROLE permission`,
			);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const seededRole = await seedRole({});
			const request = {
				roleId: faker.string.uuid(),
				name: seededRole.name,
			};

			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getRoleById(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
