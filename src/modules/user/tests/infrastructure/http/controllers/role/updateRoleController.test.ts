import type { UpdateRoleDTO } from "@/modules/user/src/dtos/userDTO";
import { UpdateRoleController } from "@/modules/user/src/infrastructure/http/controllers/role/updateRoleController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("updateRoleController", () => {
	let updateRoleController: UpdateRoleController;

	beforeAll(() => {
		updateRoleController = new UpdateRoleController();
	});

	it("should return role ID when all requests are valid", async () => {
		const seededRole = await seedRole({});
		const userWithManageRolePermission = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const request: UpdateRoleDTO = {
			roleId: seededRole.id,
			name: faker.word.noun(),
			permissions: Permissions.MANAGE_ROLE,
			requestedById: userWithManageRolePermission.id,
			color: faker.color.rgb(),
		};

		const roleId = await updateRoleController.executeImpl(request);

		expect(roleId).toBe(request.roleId);
	});

	it("should throw a ForbiddenError when the user who requested does not have the required permissions", async () => {
		const request: UpdateRoleDTO = {
			roleId: faker.string.uuid(),
			name: faker.word.noun(),
			permissions: 0,
			requestedById: faker.string.uuid(),
			color: faker.color.rgb(),
		};

		let errorMessage = "";
		try {
			await updateRoleController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}
		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_ROLE permission`,
		);
	});
});
