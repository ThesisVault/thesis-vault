import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "../../utils/user/seedUser";
import { createUserAuditLogDomainObject } from "../../utils/userAuditLog/createUserAuditLogDomainObject";

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
		
		const createdUserAuditLog = await userAuditLogRepository.createUserAuditLogs([
			seededUserAuditLogOne,
			seededUserAuditLogTwo,
		]);
		
		assertAuditLog(createdUserAuditLog[0], seededUserAuditLogOne);
		assertAuditLog(createdUserAuditLog[1], seededUserAuditLogTwo);

		const userAuditLogs = await userAuditLogRepository.getUserAuditLogsByIds([
			seededUserAuditLogOne.id,
			seededUserAuditLogTwo.id,
		]);

		assertAuditLog(userAuditLogs[0], seededUserAuditLogOne);
		assertAuditLog(userAuditLogs[1], seededUserAuditLogTwo);
	});
});
