import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogType } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogType";
import { UserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { db } from "@/shared/infrastructure/database";
import { v4 as uuid } from "uuid";
import { createUserAuditLogDomainObject } from "../../utils/userAuditLog/createUserAuditLogDomainObject";
import { seedUser } from "../../utils/user/seedUser";

const assertAuditLog = (auditLog: IUserAuditLog, expectedLog: IUserAuditLog) => {
	expect(auditLog.id).toBe(expectedLog.id);
	expect(auditLog.userId).toBe(expectedLog.userId);
	expect(auditLog.type.value).toBe(expectedLog.type.value);
	expect(auditLog.description).toBe(expectedLog.description);
};

describe("Test User Audit Log Repository createUserAuditLogs", () => {
	let userAuditLogRepository: UserAuditLogRepository;

	beforeAll(async () => {
		userAuditLogRepository = new UserAuditLogRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should create multiple user audit logs successfully", async () => {
		const seededUser = await seedUser({});
		const seededUserAuditLogOne = createUserAuditLogDomainObject({ userId: seededUser.id });
		const seededUserAuditLogTwo = createUserAuditLogDomainObject({ userId: seededUser.id });

		await userAuditLogRepository.createUserAuditLogs([seededUserAuditLogOne, seededUserAuditLogTwo]);

		const userAuditLogs = await userAuditLogRepository.getUserAuditLogsByIds([seededUserAuditLogOne.id, seededUserAuditLogTwo.id]);

		assertAuditLog(userAuditLogs[0], seededUserAuditLogOne);
		assertAuditLog(userAuditLogs[1], seededUserAuditLogTwo);
	});
});
