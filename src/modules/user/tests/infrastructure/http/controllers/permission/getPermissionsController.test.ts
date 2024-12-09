import type { GetPermissionsDTO } from "@/modules/user/src/dtos/permissionDTO";
import { GetPermissionsController } from "@/modules/user/src/infrastructure/http/controllers/permission/getPermissionsController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("GetPermissionsController", () => {
	let getPermissionsController: GetPermissionsController;

	beforeEach(() => {
		getPermissionsController = new GetPermissionsController();
	});

	it("should allow access if the user has MANAGE_PERMISSION", async () => {
		const requestedByUser = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION,
		});
		const request: GetPermissionsDTO = {
			requestedById: requestedByUser.id,
		};

		let success = false;
		try {
			await getPermissionsController.executeImpl(request);
			success = true;
		} catch (error) {
			success = false;
		}

		expect(success).toBe(true);
	});

	it("should throw ForbiddenError if the user does not have MANAGE_PERMISSION", async () => {
		const requestedByUser = await seedUser({
			allowPermissions: 0,
			denyPermissions: Permissions.MANAGE_PERMISSION,
		});
		const request: GetPermissionsDTO = {
			requestedById: requestedByUser.id,
		};

		let errorMessage = "";
		try {
			await getPermissionsController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}
		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
		);
	});
});