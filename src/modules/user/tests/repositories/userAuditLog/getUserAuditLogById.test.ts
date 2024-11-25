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

describe("Test UserAuditLogRepository getUserAuditLogById", () => {
	let auditLogRepository: IUserAuditLogRepository;

	beforeAll(() => {
		auditLogRepository = new UserAuditLogRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve an existing audit log by ID", async () => {
		const seededLog = await seedUserAuditLog({});
		console.log("Seeded audit log:", seededLog);
		const auditLog = await auditLogRepository.getUserAuditLogById(seededLog.id);

		assertAuditLog(auditLog!, seededLog);
	});

	it("should return null when audit log does not exist", async () => {
		const auditLog = await auditLogRepository.getUserAuditLogById("non-existing-id");

		expect(auditLog).toBeNull();
	});
});
