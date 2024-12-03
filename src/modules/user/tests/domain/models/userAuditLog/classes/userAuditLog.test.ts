import { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogType } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogType";
import { faker } from "@faker-js/faker";

describe("UserAuditLog", () => {
	const mockAuditLogData = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: UserAuditLogType.create("CREATE").getValue(),
		description: faker.lorem.sentences(),
		createdAt: faker.date.past(),
	};

	it("should successfully create a user audit log", () => {
		const auditLog = UserAuditLog.create(mockAuditLogData);

		expect(auditLog).toBeInstanceOf(UserAuditLog);
		expect(auditLog.id).toBe(mockAuditLogData.id);
		expect(auditLog.userId).toBe(mockAuditLogData.userId);
		expect(auditLog.typeValue).toBe(mockAuditLogData.type.value);
		expect(auditLog.description).toBe(mockAuditLogData.description);
		expect(auditLog.createdAt).toBe(mockAuditLogData.createdAt);
	});
});
