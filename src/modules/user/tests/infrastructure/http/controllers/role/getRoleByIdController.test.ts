import type { GetRoleByIdDTO } from "@/modules/user/src/dtos/userDTO";
import { GetRoleByIdController } from "@/modules/user/src/infrastructure/http/controllers/role/getRoleByIdController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("GetRoleByIdController", () => {
	let getRoleByIdController: GetRoleByIdController;

	beforeEach(() => {
		getRoleByIdController = new GetRoleByIdController();
	});

	it("should return the correct role when user has permission", async () => {
		const seededRole = await seedRole({});
		const seededUser = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const request: GetRoleByIdDTO = {
			roleId: seededRole.id,
			name: seededRole.name,
			requestedById: seededUser.id,
		};

		const result = await getRoleByIdController.executeImpl(request);

		expect(result).toBe(request.name);
	});

	it("should throw a ForbiddenError when the user who requested does not have the required permissions", async () => {
		const seededRole = await seedRole({});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: 0,
			denyPermissions: Permissions.MANAGE_ROLE,
		});

		const request: GetRoleByIdDTO = {
			roleId: seededRole.id,
			name: seededRole.name,
			requestedById: seededUserRequestedBy.id,
		};

		let errorMessage = "";
		try {
			await getRoleByIdController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toBe(`User ${request.requestedById} does not have MANAGE_ROLE permission`);
	});
});
