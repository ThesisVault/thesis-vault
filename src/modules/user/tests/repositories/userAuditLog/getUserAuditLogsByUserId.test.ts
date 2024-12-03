import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IUserAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "@/modules/user/src/repositories/userAuditLogRepository";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "../../utils/user/seedUser";

const assertAuditLog = (auditLog: IUserAuditLog, expectedLog: IUserAuditLogRawObject) => {
	expect(auditLog.id).toBe(expectedLog.id);
	expect(auditLog.userId).toBe(expectedLog.userId);
	expect(auditLog.type.value).toBe(expectedLog.type);
	expect(auditLog.description).toBe(expectedLog.description);
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
		const seededUser = await seedUser({});
		const seededLogOne = await seedUserAuditLog({ userId: seededUser.id });
		const seededLogTwo = await seedUserAuditLog({ userId: seededUser.id });
		const seededLogThree = await seedUserAuditLog({});

		const auditLogs = await auditLogRepository.getUserAuditLogsByUserId(seededUser.id);
		const auditLogsIds = auditLogs.map((auditLog) => auditLog.id);

		expect(auditLogsIds).toEqual([seededLogOne.id, seededLogTwo.id]);
		expect(auditLogsIds).not.toContain(seededLogThree.id);
		expect(auditLogs).toHaveLength(2);

		assertAuditLog(auditLogs[0], seededLogOne);
		assertAuditLog(auditLogs[1], seededLogTwo);
	});

	it("should return an empty array when no audit logs exist for the user", async () => {
		const auditLogs = await auditLogRepository.getUserAuditLogsByUserId("non-existing-user-id");

		expect(auditLogs).toHaveLength(0);
	});

	it("should return an empty array when the user exists but has no audit logs", async () => {
		const auditLogs = await auditLogRepository.getUserAuditLogsByUserId("non-existing-user-id");

		expect(auditLogs).toHaveLength(0);
	});
});
