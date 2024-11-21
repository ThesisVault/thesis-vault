import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/userDTO";
import { UpdateUserRoleIdController } from "@/modules/user/src/infrastructure/http/controllers/updateUserRoleIdController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("UpdateUserRoleIdController", () => {
	let updateUserRoleIdController: UpdateUserRoleIdController;

	beforeEach(() => {
		updateUserRoleIdController = new UpdateUserRoleIdController();
	});

	it("should return user ID when all requests are valid", async () => {
		const seededUser = await seedUser({});
		const userWithManagePermission = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION,
		});

		const request: UpdateUserRoleIdDTO = {
			userId: seededUser.id,
			roleId: faker.string.uuid(),
			requestedById: userWithManagePermission.id,
		};
		updateUserRoleIdController.executeImpl = jest.fn().mockResolvedValue(seededUser.id);
		const userId = await updateUserRoleIdController.executeImpl(request);

		expect(userId).toBe(request.userId);
	});

	it("should throw an UnauthorizedError when the user who requested does not have the required permissions", async () => {
		const request: UpdateUserRoleIdDTO = {
			userId: faker.string.uuid(),
			roleId: faker.string.uuid(),
			requestedById: faker.string.uuid(),
		};

		let errorMessage = "";
		try {
			await updateUserRoleIdController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
		);
	});
});
