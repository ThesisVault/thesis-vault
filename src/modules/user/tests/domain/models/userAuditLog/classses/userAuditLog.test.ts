import { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogDescription } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogDescription";
import { UserAuditLogType } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogType";
import { faker } from "@faker-js/faker";

describe("UserAuditLog", () => {
	const mockAuditLogData = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: UserAuditLogType.create("CREATE").getValue(),
		description: UserAuditLogDescription.create("User created successfully").getValue(),
		createdAt: faker.date.past(),
	};

	it("should successfully create a user audit log", () => {
		const log = UserAuditLog.create(mockAuditLogData);
		expect(log).toBeInstanceOf(UserAuditLog);
		expect(log.id).toBe(mockAuditLogData.id);
		expect(log.userId).toBe(mockAuditLogData.userId);
		expect(log.type.value).toBe(mockAuditLogData.type.value);
		expect(log.description.value).toBe(mockAuditLogData.description.value);
		expect(log.createdAt).toBeInstanceOf(Date);
	});
});
