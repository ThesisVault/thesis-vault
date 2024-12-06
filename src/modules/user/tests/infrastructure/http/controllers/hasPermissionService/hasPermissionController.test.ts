import type { HasPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionController } from "@/modules/user/src/infrastructure/http/controllers/hasPermissionService/hasPermissionController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";

describe("hasPermissionController", () => {
	let hasPermissionController: HasPermissionController;

	beforeAll(() => {
		hasPermissionController = new HasPermissionController();
	});

	it("should return true when the user has the required permission", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});

		const userWithPermission = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION
		});

		const request: HasPermissionDTO = {
			userId: seededUser.id,
			permission: seededRole.permissions,
			requestedById: userWithPermission.id,
		};

		const hasPermission = await hasPermissionController.executeImpl(request);
		expect(hasPermission).toBe(true);
	});

	it("should throw ForbiddenError if the user does not have MANAGE_PERMISSION", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});

		const userWithoutPermission = await seedUser({
			allowPermissions: 0,
			denyPermissions: 0,
		});

		const request: HasPermissionDTO = {
			userId: seededUser.id,
			permission: seededRole.permissions,
			requestedById: userWithoutPermission.id,
		};

		await expect(hasPermissionController.executeImpl(request)).rejects.toThrow(ForbiddenError);
	});
});
