import type { HasPermissionByUserIdDTO } from "@/modules/user/src/dtos/userDTO";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { HasPermissionByUserIdUseCase } from "@/modules/user/src/useCases/user/hasPermissionByUserIdUseCase";
import { NotFoundError } from "@/shared/core/errors";
import { seedRole } from "../../utils/role/seedRole";
import { seedUser } from "../../utils/user/seedUser";
describe("HasPermissionUseCase", () => {
	let hasPermissionUseCase: HasPermissionByUserIdUseCase;

	beforeAll(() => {
		hasPermissionUseCase = new HasPermissionByUserIdUseCase();
	});

	describe("User Permission", () => {
		it("should return true when the user has the required permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: Permissions.VIEW_RESOURCES,
			});

			const request: HasPermissionByUserIdDTO = {
				userId: seededUser.id,
				permission: Permissions.VIEW_RESOURCES,
				requestedById: seededUser.id,
			};

			const hasPermission = await hasPermissionUseCase.execute(request);
			expect(hasPermission).toBe(true);
		});

		it("should return false when the user does not have the required permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: 0,
				denyPermissions: 0,
			});

			const request: HasPermissionByUserIdDTO = {
				userId: seededUser.id,
				permission: Permissions.DELETE_USER,
				requestedById: seededUser.id,
			};

			const hasPermission = await hasPermissionUseCase.execute(request);
			expect(hasPermission).toBe(false);
		});

		it("should throw an NotFoundError if the is no user", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({ roleId: seededRole.id });

			const request: HasPermissionByUserIdDTO = {
				userId: "non-existing-id",
				permission: seededUser.allowPermissions,
				requestedById: seededUser.id,
			};

			let errorMessage = "";
			try {
				await hasPermissionUseCase.execute(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(NotFoundError);
			}

			expect(errorMessage).toBe(`User with ID ${request.userId} not found`);
		});
	});

	describe("Role Permission", () => {
		it("should return true when the user role has the required permission", async () => {
			const seededRole = await seedRole({
				permissions: Permissions.DELETE_USER,
			});
			const seededUser = await seedUser({
				roleId: seededRole.id,
			});

			const request: HasPermissionByUserIdDTO = {
				userId: seededUser.id,
				permission: Permissions.DELETE_USER,
				requestedById: seededUser.id,
			};

			const hasPermission = await hasPermissionUseCase.execute(request);
			expect(hasPermission).toBe(true);
		});

		it("should return false when the user role does not have the required permission", async () => {
			const seededRole = await seedRole({
				permissions: 0,
			});
			const seededUser = await seedUser({
				roleId: seededRole.id,
			});

			const request: HasPermissionByUserIdDTO = {
				userId: seededUser.id,
				permission: Permissions.DELETE_USER,
				requestedById: seededUser.id,
			};

			const hasPermission = await hasPermissionUseCase.execute(request);
			expect(hasPermission).toBe(false);
		});

		it("should throw an NotFoundError if the is no user", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({ roleId: seededRole.id });

			const request: HasPermissionByUserIdDTO = {
				userId: "non-existing-id",
				permission: seededRole.permissions,
				requestedById: seededUser.id,
			};

			let errorMessage = "";
			try {
				await hasPermissionUseCase.execute(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(NotFoundError);
			}

			expect(errorMessage).toBe(`User with ID ${request.userId} not found`);
		});
	});
});
