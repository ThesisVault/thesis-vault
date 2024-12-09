import type { HasPermissionByUserIdDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionByUserIdController } from "@/modules/user/src/infrastructure/http/controllers/user/hasPermissionByUserIdController";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("hasPermissionController", () => {
	let hasPermissionByUserIdController: HasPermissionByUserIdController;

	beforeAll(() => {
		hasPermissionByUserIdController = new HasPermissionByUserIdController();
	});

	it("should return true when the user has the required permission", async () => {
		const seededRole = await seedRole({});
		const seededUser = await seedUser({ roleId: seededRole.id });

		const request: HasPermissionByUserIdDTO = {
			userId: seededUser.id,
			permission: seededUser.allowPermissions,
			requestedById: seededUser.id,
		};

		const hasPermission = await hasPermissionByUserIdController.executeImpl(request);
		expect(hasPermission).toBe(true);
	});
});
