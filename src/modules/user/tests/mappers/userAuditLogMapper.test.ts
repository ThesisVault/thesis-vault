import { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import { createUserAuditLogDomainObject } from "@/modules/user/tests/utils/userAuditLog/createUserAuditLogDO";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";

describe("UserAuditLogMapper", () => {
	it("should map to domain from raw data", async () => {
		const rawData = await seedUserAuditLog({}); // seeding the user audit log

		const userAuditLogDomainObject = UserAuditLogMapper.toDomain(rawData);

		expect(userAuditLogDomainObject).toBeInstanceOf(UserAuditLog);
		expect(userAuditLogDomainObject.id).toBe(rawData.id);
		expect(userAuditLogDomainObject.userId).toBe(rawData.userId);
		expect(userAuditLogDomainObject.type).toBe(rawData.type);
		expect(userAuditLogDomainObject.description).toBe(rawData.description);
		expect(userAuditLogDomainObject.createdAt).toBe(rawData.createdAt);
	});

	it("should map to persistence from domain", () => {
		const userAuditLog = createUserAuditLogDomainObject({});
		const userAuditLogPersistenceObject = UserAuditLogMapper.toPersistence(userAuditLog);

		expect(userAuditLogPersistenceObject.id).toBe(userAuditLog.id);
		expect(userAuditLogPersistenceObject.user?.connect?.id).toBe(userAuditLog.userId);
		expect(userAuditLogPersistenceObject.type).toBe(userAuditLog.type);
		expect(userAuditLogPersistenceObject.description).toBe(userAuditLog.description);
		expect(userAuditLogPersistenceObject.createdAt).toBe(userAuditLog.createdAt);
	});
});
