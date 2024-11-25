import type { UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { UpdateUserPermissionController } from "@/modules/user/src/infrastructure/http/controllers/updateUserPermissionController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("updateUserPermissionController", () => {
	let updateUserPermissionController: UpdateUserPermissionController;

	beforeAll(() => {
		updateUserPermissionController = new UpdateUserPermissionController();
	});

	it("should throw an UnauthorizedError when the user who requested does not have a required permissions", async () => {
		const request: UpdateUserPermissionDTO = {
			allowPermission: 0,
			denyPermission: 0,
			userId: faker.string.uuid(),
			requestedById: faker.string.uuid(),
		};

		let errorMessage = "";
		try {
			await updateUserPermissionController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}
		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
		);
	});

	it("should return user id when all request is valid", async () => {
		const seededUser = await seedUser({});
		const userWithManagePermission = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION,
		});

		const request: UpdateUserPermissionDTO = {
			allowPermission: Permissions.MANAGE_PERMISSION,
			denyPermission: Permissions.UPDATE_USER,
			userId: seededUser.id,
			requestedById: userWithManagePermission.id,
		};
		const userId = await updateUserPermissionController.executeImpl(request);

		expect(userId).toBe(request.userId);
	});
});
