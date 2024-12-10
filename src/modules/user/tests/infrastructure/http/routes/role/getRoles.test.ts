import { roleRouter } from "@/modules/user/src/infrastructure/http/routes/roleRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import type { TRPCError } from "@trpc/server";

describe("getRolesEndPoint", () => {
	describe("User is authenticated", () => {
		beforeEach(async () => {
			await db.role.deleteMany();
		});

		it("should return roles", async () => {
			const seededAuthenticatedUser = await seedUser({
				allowPermissions: Permissions.MANAGE_ROLE,
			});

			const seededRoleOne = await seedRole({});
			const seededRoleTwo = await seedRole({});
			const seededRoleThree = await seedRole({});

			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededAuthenticatedUser.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const roles = await caller.getRoles();

			expect(roles[0].id).toBe(seededRoleOne.id);
			expect(roles[1].id).toBe(seededRoleTwo.id);
			expect(roles[2].id).toBe(seededRoleThree.id);
		});

		it("should return empty array when no role has found", async () => {
			const seededAuthenticatedUser = await seedUser({
				allowPermissions: Permissions.MANAGE_ROLE,
			});

			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededAuthenticatedUser.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const roles = await caller.getRoles();

			expect(roles).toEqual([]);
		});

		it("should throw an error if user is unauthorized", async () => {
			const seededUserWithoutPermission = await seedUser({
				allowPermissions: 0,
				denyPermissions: Permissions.MANAGE_ROLE,
			});

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
				await caller.getRoles();
			} catch (error) {
				errorMessage = (error as Error).message;
			}

			expect(errorMessage).toBe(
				`User ${seededUserWithoutPermission.id} does not have MANAGE_ROLE permission`,
			);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getRoles();
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
