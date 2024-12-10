import { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";
import type { UpdateRoleDTO } from "@/modules/user/src/dtos/roleDTO";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { UpdateRoleUseCase } from "@/modules/user/src/useCases/role/updateRoleUseCase";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { BadRequestError, NotFoundError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";

describe("UpdateRoleUseCase", () => {
	let updateRoleUseCase: UpdateRoleUseCase;
	let roleRepository: IRoleRepository;

	beforeAll(() => {
		updateRoleUseCase = new UpdateRoleUseCase();
		roleRepository = new RoleRepository();
	});

	it("should successfully update role and return roleId", async () => {
		const seededRole = await seedRole({});
		const seededUser = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const request: UpdateRoleDTO = {
			roleId: seededRole.id,
			name: faker.word.noun(),
			permissions: Permissions.MANAGE_ROLE,
			requestedById: seededUser.id,
			color: faker.color.rgb(),
		};

		const result = await updateRoleUseCase.execute(request);

		expect(result).toBe(request.roleId);

		const updatedRole = await roleRepository.getRoleById(result);

		expect(updatedRole).not.toBeNull();
		expect(updatedRole!.nameValue).toBe(request!.name);
		expect(updatedRole!.permissionsValue).toBe(Permissions.MANAGE_ROLE);
		expect(updatedRole!.color).toBe(request!.color);
	});

	it("should throw NotFoundError if role does not exist", async () => {
		const request: UpdateRoleDTO = {
			roleId: "non-existent-role-id",
			name: faker.lorem.word(),
			permissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
			requestedById: faker.string.uuid(),
			color: faker.color.rgb(),
		};

		let errorMessage = "";
		try {
			await updateRoleUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}

		expect(errorMessage).toBe(`Role ${request.roleId} was not found.`);
	});

	it("should throw BadRequestError if the permissions are invalid", async () => {
		const seededRole = await seedRole({});
		const seededUser = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const request: UpdateRoleDTO = {
			roleId: seededRole.id,
			name: faker.lorem.word(),
			permissions: -1,
			requestedById: seededUser.id,
			color: faker.color.rgb(),
		};

		let errorMessage = "";
		try {
			await updateRoleUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(BadRequestError);
		}

		expect(errorMessage).toBe(
			`Permission value must be greater than or equal ${RolePermission.MINIMUM_PERMISSION_BITS_VALUE}`,
		);
	});
});
