import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "@/modules/user/src/repositories/userAuditLogRepository";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { db } from "@/shared/infrastructure/database";

const assertAuditLog = (auditLog: IUserAuditLog, expectedLog: IUserAuditLog) => {
	expect(auditLog.id).toBe(expectedLog.id);
	expect(auditLog.userId).toBe(expectedLog.userId);
	expect(auditLog.type).toBe(expectedLog.type);
	expect(auditLog.description).toBe(expectedLog.description);
	expect(auditLog.createdAt.toISOString()).toBe(expectedLog.createdAt.toISOString());
};

describe("Test UserAuditLogRepository getUserAuditLogsByUserId", () => {
	let auditLogRepository: IUserAuditLogRepository;

	beforeAll(() => {
		auditLogRepository = new UserAuditLogRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve audit logs by user ID", async () => {
		const seededLog1 = await seedUserAuditLog({});
		const seededLog2 = await seedUserAuditLog({ userId: seededLog1.userId });

		const auditLogs = await auditLogRepository.getUserAuditLogsByUserId(seededLog1.userId);

		expect(auditLogs).toHaveLength(2);

		assertAuditLog(auditLogs[0], seededLog1);
		assertAuditLog(auditLogs[1], seededLog2);
	});

	it("should return an empty array when no audit logs exist for the user", async () => {
		const auditLogs = await auditLogRepository.getUserAuditLogsByUserId("non-existing-user-id");

		expect(auditLogs).toHaveLength(0);
	});
});
