import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/userDTO";
import { UpdateUserRoleIdController } from "@/modules/user/src/infrastructure/http/controllers/updateUserRoleIdController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("UpdateUserRoleIdController", () => {
	let updateUserRoleIdController: UpdateUserRoleIdController;

	beforeEach(() => {
		updateUserRoleIdController = new UpdateUserRoleIdController();
	});

	it("should return user ID when all requests are valid", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION,
		});

		const request: UpdateUserRoleIdDTO = {
			userId: seededUser.id,
			roleId: seededRole.id,
			requestedById: seededUserRequestedBy.id,
		};

		const userId = await updateUserRoleIdController.executeImpl(request);

		expect(userId).toBe(request.userId);
	});

	it("should throw an UnauthorizedError when the user who requested does not have the required permissions", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});
		const seededUserRequestedBy = await seedUser({});

		const request: UpdateUserRoleIdDTO = {
			userId: seededUser.id,
			roleId: seededRole.id,
			requestedById: seededUserRequestedBy.id,
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
