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
		const domainRole = RoleMapper.toDomain({
			...seededRole,
			name: faker.person.fullName(),
			permissions: Permissions.MANAGE_ROLE,
		});

		const seededRoleTwo = await seedRole({});
		const domainRoleTwo = RoleMapper.toDomain({
			...seededRoleTwo,
			name: faker.person.fullName(),
			permissions: Permissions.MANAGE_ROLE,
		});

		const updatedRoles = await roleRepository.updateRoles([domainRole, domainRoleTwo]);

		expect(updatedRoles.length).toBe(2);
		expect(updatedRoles[0].id).toBe(seededRole.id);
		expect(updatedRoles[0].nameValue).toBe(domainRole.nameValue);
		expect(updatedRoles[0].permissionsValue).toBe(domainRole.permissionsValue);
		expect(updatedRoles[1].id).toBe(seededRoleTwo.id);
		expect(updatedRoles[1].nameValue).toBe(domainRoleTwo.nameValue);
		expect(updatedRoles[1].permissionsValue).toBe(domainRoleTwo.permissionsValue);
	});

	it("should return empty array when updating multiple role and 1 failed", async () => {
		const seededRole = await seedRole({});
		const nonExistingRole = createRoleDomainObject({});

		const role = await roleRepository.updateRoles([
			RoleMapper.toDomain({
				...seededRole,
				name: "Luis Joshua",
			}),
			nonExistingRole,
		]);

		expect(role.length).toBe(0);
	});
});
