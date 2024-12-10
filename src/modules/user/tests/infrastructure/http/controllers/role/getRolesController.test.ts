import type { GetRolesDTO } from "@/modules/user/src/dtos/roleDTO";
import { GetRolesController } from "@/modules/user/src/infrastructure/http/controllers/role/getRolesController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("GetRoleByIdController", () => {
	let getRolesController: GetRolesController;

	beforeAll(() => {
		getRolesController = new GetRolesController();
	});

	beforeEach(async () => {
		await db.role.deleteMany();
	});

	it("should return roles", async () => {
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const seededRoleOne = await seedRole({});
		const seededRoleTwo = await seedRole({});
		const seededRoleThree = await seedRole({});

		const request: GetRolesDTO = {
			requestedById: seededUserRequestedBy.id,
		};

		const result = await getRolesController.executeImpl(request);

		expect(result[0].id).toBe(seededRoleOne.id);
		expect(result[1].id).toBe(seededRoleTwo.id);
		expect(result[2].id).toBe(seededRoleThree.id);
	});

	it("should return empty array when no role has found", async () => {
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const request: GetRolesDTO = {
			requestedById: seededUserRequestedBy.id,
		};

		const result = await getRolesController.executeImpl(request);

		expect(result).toEqual([]);
	});

	it("should throw a ForbiddenError when the user who requested does not have a required permissions", async () => {
		const seededUser = await seedUser({
			allowPermissions: 0,
			denyPermissions: 0,
		});

		const request: GetRolesDTO = {
			requestedById: seededUser.id,
		};

		let errorMessage = "";
		try {
			await getRolesController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_ROLE permission`,
		);
	});
});
