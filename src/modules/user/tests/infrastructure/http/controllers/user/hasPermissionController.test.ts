import type { HasPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionController } from "@/modules/user/src/infrastructure/http/controllers/user/hasPermissionController";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("hasPermissionController", () => {
	let hasPermissionController: HasPermissionController;

	beforeAll(() => {
		hasPermissionController = new HasPermissionController();
	});

	it("should return true when the user has the required permission", async () => {
		const seededRole = await seedRole({});
		const seededUser = await seedUser({ roleId: seededRole.id });

		const request: HasPermissionDTO = {
			userId: seededUser.id,
			permission: seededUser.allowPermissions,
			requestedById: seededUser.id,
		};

		const hasPermission = await hasPermissionController.executeImpl(request);
		expect(hasPermission).toBe(true);
	});
});
