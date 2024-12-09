import type { CreateRoleDTO } from "@/modules/user/src/dtos/roleDTO";
import { CreateRoleController } from "@/modules/user/src/infrastructure/http/controllers/role/createRoleController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("CreateRoleController", () => {
	let createRoleController: CreateRoleController;

	beforeAll(() => {
		createRoleController = new CreateRoleController();
	});

  // it("should return the newly created role ID upon successful creation", async () => {

	// 	const seededUser = await seedUser({
	// 		allowPermissions: Permissions.MANAGE_PERMISSION,
	// 		denyPermissions: 0,
	// 	});

  //   const request: CreateRoleDTO = {
	// 		name: faker.word.noun(),
	// 		requestedById: seededUser.id,
	// 		permissions: 0,
	// 		color: faker.color.rgb(),
	// 	};


	// 	const result = await createRoleController.executeImpl(request);

	// 	expect(result).toBe(request.requestedById);
	// });

	it("should throw a Error when the user who requested does not have a required permissions", async () => {
		const user = await seedUser({
      allowPermissions: 0,
    });

		const request: CreateRoleDTO = {
			name: faker.word.noun(),
			requestedById: user.id,
			permissions: Permissions.MANAGE_PERMISSION,
			color: faker.color.rgb(),
		};

		let errorMessage = "";
		try {
			await createRoleController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
		);
	});

});
