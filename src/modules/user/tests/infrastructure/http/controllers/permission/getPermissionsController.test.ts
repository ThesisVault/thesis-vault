import type { getPermissionsDTO } from "@/modules/user/src/dtos/permissionDTO";
import { GetPermissionsController } from "@/modules/user/src/infrastructure/http/controllers/permission/getPermissionsController";
import { PermissionsDetail } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import type { ForbiddenError } from "@/shared/core/errors";

describe("GetPermissionsController", () => {
	let getPermissionsController: GetPermissionsController;

	beforeEach(() => {
		getPermissionsController = new GetPermissionsController();
	});

	it("should throw ForbiddenError if the user does not have MANAGE_PERMISSION", async () => {
		const requestedByuser = await seedUser({
			allowPermissions: PermissionsDetail.MANAGE_PERMISSION,
		});
		const request: getPermissionsDTO = {
			requestedById: requestedByuser.id,
		};

		let errorMessage = "";
		try {
			await getPermissionsController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as ForbiddenError).message;
		}
		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
		);
	});
});
