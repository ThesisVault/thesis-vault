import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { createRoleDomainObject } from "../../utils/role/createRoleDomainObject";

const assertRole = (role: IRole, expectedRole: IRole) => {
	expect(role.id).toBe(expectedRole.id);
	expect(role.nameValue).toBe(expectedRole.nameValue);
	expect(role.color).toBe(expectedRole.color);
	expect(role.permissionsValue).toBe(expectedRole.permissionsValue);
	expect(role.createdAt.toString).toBe(expectedRole.createdAt.toString);
	expect(role.deletedAt).toBe(expectedRole.deletedAt);
	expect(role.isDeleted).toBe(expectedRole.isDeleted);
	expect(role.updatedAt).toBe(expectedRole.updatedAt);
};

describe("Role Repository createRole", () => {
	let roleRepository: IRoleRepository;

	beforeAll(async () => {
		roleRepository = new RoleRepository();
	});

	it("should create role successfully", async () => {
		const roleDomainObject = createRoleDomainObject({
			updatedAt: null,
			deletedAt: null,
		});

		const createdRole = await roleRepository.createRole(roleDomainObject);

		assertRole(createdRole!, roleDomainObject);

		const role = await roleRepository.getRoleById(roleDomainObject.id);

		assertRole(role!, roleDomainObject);
	});
});
