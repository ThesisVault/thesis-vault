import { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";

describe("RolePermission", () => {
	it("should create a RolePermission instance with valid permission bits", () => {
		const result = RolePermission.create(15);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(RolePermission);
		expect(result.getValue().value).toBe(15);
	});

	it("should fail if permissionBits is negative", () => {
		const result = RolePermission.create(-1);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe(
			`Permission value must be greater than or equal ${RolePermission.MINIMUM_PERMISSION_BITS_VALUE}`,
		);
	});

	it("should fail if permissionBits is greater than maximum value", () => {
		const result = RolePermission.create(RolePermission.MAXIMUM_PERMISSION_BITS_VALUE + 1);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe(
			`Permission value must be less than or equal ${RolePermission.MAXIMUM_PERMISSION_BITS_VALUE}`,
		);
	});
});
