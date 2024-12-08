import { RoleMapper } from "@/modules/user/src/mappers/roleMapper";
import { RoleRepository } from "@/modules/user/src/repositories/roleRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { createRoleDomainObject } from "@/modules/user/tests/utils/role/createRoleDomainObject";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { faker } from "@faker-js/faker";

describe("RoleRepository.updateRole", () => {
	let roleRepository: RoleRepository;

	beforeAll(async () => {
		roleRepository = new RoleRepository();
	});

	it("should successfully update role properties", async () => {
		const seededRole = await seedRole({});
		const newRoleData = {
			...seededRole,
			name: faker.person.fullName(),
			permissions: Permissions.MANAGE_ROLE,
		};

		const domainRole = RoleMapper.toDomain({
			...seededRole,
			...newRoleData,
		});
		const updatedRole = await roleRepository.updateRole(domainRole);

		expect(updatedRole).toBeTruthy();
		expect(updatedRole!.id).toBe(seededRole.id);
		expect(updatedRole!.nameValue).toBe(newRoleData.name);
		expect(updatedRole!.permissionsValue).toBe(newRoleData.permissions);
	});

	it("should return null when trying to update a non-existing role", async () => {
		const roleDomainObject = createRoleDomainObject({});
		const updatedRole = await roleRepository.updateRole(roleDomainObject);

		expect(updatedRole).toBeNull();
	});
});
