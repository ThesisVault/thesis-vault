import { GetPermissionsController } from "@/modules/user/src/infrastructure/http/controllers/permission/getPermissionsController";

describe("GetPermissionsController", () => {
	let getPermissionsController: GetPermissionsController;

	beforeEach(() => {
		getPermissionsController = new GetPermissionsController();
	});

	it("should throw ForbiddenError if the user does not have MANAGE_PERMISSION", async () => {});
});
