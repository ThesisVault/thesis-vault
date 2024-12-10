import { roleRouter } from "@/modules/user/src/infrastructure/http/routes/roleRouter";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("createRoleEndpoint", () => {
	let roleRepository: IRoleRepository;
	beforeAll(() => {
		roleRepository = new RoleRepository();
	});
	describe("User is authenticated", () => {
		it("should successfully create role when user is authorized", async () => {
			const seededUser = await seedUser({
				allowPermissions: Permissions.MANAGE_ROLE,
			});

			const request = {
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

			const roleId = await caller.createRole(request);
			const createRole = await roleRepository.getRoleById(roleId);
			expect(createRole).not.toBeNull();
			expect(createRole!.nameValue).toBe(request.name);
			expect(createRole!.permissionsValue).toBe(request.permissions);
			expect(createRole!.color).toBe(request.color);
		});

		it("should throw an error if user is unauthorized", async () => {
			const seededUserWithoutPermission = await seedUser({
				allowPermissions: 0,
				denyPermissions: Permissions.MANAGE_ROLE,
			});
			const request = {
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
				await caller.createRole(request);
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
				await caller.createRole(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
