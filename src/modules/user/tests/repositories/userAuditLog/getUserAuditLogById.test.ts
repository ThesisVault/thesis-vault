import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "@/modules/user/src/repositories/userAuditLogRepository";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { db } from "@/shared/infrastructure/database";

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
		const auditLog = await auditLogRepository.getUserAuditLogById(seededLog.id);

		expect(auditLog?.id).toBe(seededLog.id);
		expect(auditLog?.userId).toBe(seededLog.userId);
		expect(auditLog?.type.value).toBe(seededLog.type);
		expect(auditLog?.description.value).toBe(seededLog.description);
		expect(auditLog?.createdAt.toISOString()).toBe(seededLog.createdAt.toISOString());
	});

	it("should return null when audit log does not exist", async () => {
		const auditLog = await auditLogRepository.getUserAuditLogById("non-existing-id");

		expect(auditLog).toBeNull();
	});
});
