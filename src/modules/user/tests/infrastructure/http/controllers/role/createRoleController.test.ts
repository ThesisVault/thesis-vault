import type { CreateRoleDTO } from "@/modules/user/src/dtos/roleDTO";
import { CreateRoleController } from "@/modules/user/src/infrastructure/http/controllers/role/createRoleController";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("CreateRoleController", () => {
	let createRoleController: CreateRoleController;
	let roleRepository: IRoleRepository;

	beforeAll(() => {
		createRoleController = new CreateRoleController();
		roleRepository = new RoleRepository();
	});

	it("should successfully create role with required permission", async () => {
		const seededUser = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const request = {
			name: faker.word.noun(),
			permissions: Permissions.MANAGE_ROLE,
			color: faker.color.rgb(),
			requestedById: seededUser.id,
		};

		const result = await createRoleController.executeImpl(request);
		const createdRole = await roleRepository.getRoleById(result);

		expect(createdRole).not.toBeNull();
		expect(createdRole!.nameValue).toBe(request!.name);
		expect(createdRole!.color).toBe(request!.color);
		expect(createdRole!.permissionsValue).toBe(request!.permissions);
	});

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
