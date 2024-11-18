import { Role } from "@/modules/user/src/domain/models/role/classes/role";
import { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import { type IRoleFactory, RoleFactory } from "@/modules/user/src/domain/models/role/factory";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { faker } from "@faker-js/faker";

describe("RoleFactory", () => {
	let mockRoleData: IRoleFactory;

	beforeEach(() => {
		mockRoleData = {
			id: faker.string.uuid(),
			name: faker.lorem.word(),
			permissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
		};
	});

	it("should successfully create a Role when all properties are valid", () => {
		const result = RoleFactory.create(mockRoleData);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(Role);

		const role = result.getValue();
		expect(role.id).toBe(mockRoleData.id);
		expect(role.nameValue).toBe(mockRoleData.name);
		expect(role.permissionsValue).toBe(mockRoleData.permissions);
		expect(role.createdAt).toBe(mockRoleData.createdAt);
		expect(role.updatedAt).toBe(mockRoleData.updatedAt);
	});

	it("should fail if name is greater than the maximum value", () => {
		const invalidNameProps = {
			...mockRoleData,
			name: "a".repeat(RoleName.MAXIMUM_ROLE_NAME_LENGTH + 1),
		};
		const result = RoleFactory.create(invalidNameProps);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe(
			`Role name is limited to ${RoleName.MAXIMUM_ROLE_NAME_LENGTH} characters long`,
		);
	});

	it("should fail when permission have negative value", () => {
		const invalidPermissionProps = { ...mockRoleData, permissions: -1 };
		const result = RoleFactory.create(invalidPermissionProps);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe("Permission value must be greater than or equal 0");
	});
});
