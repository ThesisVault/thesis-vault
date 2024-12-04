import type { DeleteUserDTO } from "@/modules/user/src/dtos/userDTO";
import { DeleteUserController } from "@/modules/user/src/infrastructure/http/controllers/user/deleteUserController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("deleteUserController", () => {
	let deleteUserController: DeleteUserController;

	beforeAll(() => {
		deleteUserController = new DeleteUserController();
	});

	it("should return user id when all request is valid", async () => {
		const seededUser = await seedUser({});
		const userWithDeleteUserPermission = await seedUser({
			allowPermissions: Permissions.DELETE_USER,
			denyPermissions: 0,
		});

		const request: DeleteUserDTO = {
			userId: seededUser.id,
			requestedById: userWithDeleteUserPermission.id,
		};
		const userId = await deleteUserController.executeImpl(request);

		expect(userId).toBe(request.userId);
	});

	it("should throw an ForbiddenError when the user who requested does not have a required permissions", async () => {
		const request: DeleteUserDTO = {
			userId: faker.string.uuid(),
			requestedById: faker.string.uuid(),
		};

		let errorMessage = "";
		try {
			await deleteUserController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}
		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have DELETE_USER permission`,
		);
	});
});
