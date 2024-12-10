import { roleRouter } from "@/modules/user/src/infrastructure/http/routes/roleRouter";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("updateRoleEndPoint", () => {
	let roleRepository: IRoleRepository;

	beforeAll(() => {
		roleRepository = new RoleRepository();
	});

	describe("User is authenticated", () => {
		it("should successfully update role and return roleId", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({
				allowPermissions: Permissions.MANAGE_ROLE,
			});

			const request = {
				roleId: seededRole.id,
				name: faker.word.noun(),
				permissions: Permissions.MANAGE_ROLE,
				color: faker.color.rgb(),
			};

			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUser.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const roleId = await caller.updateRole(request);

			expect(roleId).toBe(seededRole.id);

			const updatedRole = await roleRepository.getRoleById(roleId);
			expect(updatedRole).not.toBeNull();
			expect(updatedRole!.nameValue).toBe(request.name);
			expect(updatedRole!.permissionsValue).toBe(request.permissions);
			expect(updatedRole!.color).toBe(request.color);
		});

		it("should return an error if user does not have MANAGE_ROLE permission", async () => {
			const seededRole = await seedRole({});
			const seededUserWithoutPermission = await seedUser({
				allowPermissions: 0,
			});

			const request = {
				roleId: seededRole.id,
				name: faker.word.noun(),
				permissions: Permissions.MANAGE_ROLE,
				color: faker.color.rgb(),
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
				await caller.updateRole(request);
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
			const request = {
				roleId: faker.string.uuid(),
				name: faker.word.noun(),
				permissions: Permissions.MANAGE_ROLE,
				color: faker.color.rgb(),
			};

			const createdCaller = createCallerFactory(roleRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.updateRole(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
