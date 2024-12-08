import { RoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import { RoleAuditLogFactory } from "@/modules/user/src/domain/models/roleAuditLog/factory";
import { faker } from "@faker-js/faker";

describe("UserAuditLogFactory", () => {
	const validRoleAuditLogProps = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: "CREATE",
		description: faker.lorem.sentences(),
		createdAt: faker.date.past(),
		roleId: faker.string.uuid(),
	};

	it("should create a valid RoleAuditLog", () => {
		const result = RoleAuditLogFactory.create(validRoleAuditLogProps);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(RoleAuditLog);

		const roleAuditLog = result.getValue();
		expect(roleAuditLog.id).toBe(validRoleAuditLogProps.id);
		expect(roleAuditLog.userId).toBe(validRoleAuditLogProps.userId);
		expect(roleAuditLog.type.value).toBe(validRoleAuditLogProps.type);
		expect(roleAuditLog.description).toBe(validRoleAuditLogProps.description);
		expect(roleAuditLog.createdAt).toBe(validRoleAuditLogProps.createdAt);
	});

	it("should create a valid RoleAuditLog even id is not provided", () => {
		const result = RoleAuditLogFactory.create({
			...validRoleAuditLogProps,
			id: undefined,
		});

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(RoleAuditLog);

		const roleAuditLog = result.getValue();
		expect(roleAuditLog.id).not.toBeUndefined();
		expect(roleAuditLog.userId).toBe(validRoleAuditLogProps.userId);
		expect(roleAuditLog.type.value).toBe(validRoleAuditLogProps.type);
		expect(roleAuditLog.description).toBe(validRoleAuditLogProps.description);
		expect(roleAuditLog.createdAt).toBe(validRoleAuditLogProps.createdAt);
	});

	it("should fail if the type is invalid", () => {
		const invalidTypeProps = {
			...validRoleAuditLogProps,
			type: "INVALID_TYPE",
		};

		const result = RoleAuditLogFactory.create(invalidTypeProps);

		expect(result.isFailure).toBe(true);
	});
});
