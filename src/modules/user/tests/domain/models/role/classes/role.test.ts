import { Role } from "@/modules/user/src/domain/models/role/classes/role";
import { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { faker } from "@faker-js/faker";

describe("Role", () => {
	const mockRoleData = {
		id: faker.string.uuid(),
		name: RoleName.create(faker.lorem.word()).getValue(),
		permissions: RolePermission.create(
			faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
		).getValue(),
		color: faker.color.rgb(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
	};

	it("should create a Role", () => {
		const role = Role.create(mockRoleData);

		expect(role).toBeInstanceOf(Role);
		expect(role.id).toBe(mockRoleData.id);
		expect(role.nameValue).toBe(mockRoleData.name.value);
		expect(role.color).toBe(mockRoleData.color);
		expect(role.createdAt.toString()).toBe(mockRoleData.createdAt.toString());
		expect(role.updatedAt.toString()).toBe(mockRoleData.updatedAt.toString());
	});
});
