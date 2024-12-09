import { RoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import { RoleAuditLogType } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLogType";
import { RoleAuditLogTypes } from "@/modules/user/src/domain/models/roleAuditLog/constant";
import { faker } from "@faker-js/faker";

describe("RoleAuditLog", () => {
	const mockRoleAuditLogData = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: RoleAuditLogType.create(faker.helpers.arrayElement(Object.values(RoleAuditLogTypes))).getValue(),
		description: faker.lorem.sentences(),
		createdAt: faker.date.past(),
		roleId: faker.string.uuid(),
	};

	it("should successfully create a roleAuditLog", () => {
		const auditLog = RoleAuditLog.create(mockRoleAuditLogData);

		expect(auditLog).toBeInstanceOf(RoleAuditLog);
		expect(auditLog.id).toBe(mockRoleAuditLogData.id);
		expect(auditLog.userId).toBe(mockRoleAuditLogData.userId);
		expect(auditLog.typeValue).toBe(mockRoleAuditLogData.type.value);
		expect(auditLog.description).toBe(mockRoleAuditLogData.description);
		expect(auditLog.createdAt).toBe(mockRoleAuditLogData.createdAt);
	});
});
