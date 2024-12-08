import type { DeleteRoleDTO } from "@/modules/user/src/dtos/userDTO";
import { roleRouter } from "@/modules/user/src/infrastructure/http/routes/roleRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("deleteRoleEndpoint", () => {
	describe("User is authenticated", () => {
		it("should successfully delete role when user is authorized", async () => {
			const seededRole = await seedRole({});
			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.MANAGE_ROLE,
				denyPermissions: 0,
			});
			const request: DeleteRoleDTO = {
				roleId: seededRole.id,
				requestedById: seededUserWithPermission.id,
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

			const roleId = await caller.deleteRole(request);

			expect(roleId).toBe(seededRole.id);
		});

		it("should throw an error if user is unauthorized", async () => {
			const seededUserWithoutPermission = await seedUser({
				allowPermissions: 0,
				denyPermissions: Permissions.MANAGE_ROLE,
			});
			const request: DeleteRoleDTO = {
				roleId: faker.string.uuid(),
				requestedById: seededUserWithoutPermission.id,
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
				await caller.deleteRole(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
			);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const request = {
				roleId: faker.string.uuid(),
				requestedById: faker.string.uuid(),
			};

			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.deleteRole(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
