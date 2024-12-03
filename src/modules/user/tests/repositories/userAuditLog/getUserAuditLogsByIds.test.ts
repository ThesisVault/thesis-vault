import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IUserAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "@/modules/user/src/repositories/userAuditLogRepository";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { db } from "@/shared/infrastructure/database";

const assertUserAuditLog = (
	userAuditLogValue: IUserAuditLog,
	expectedUserAuditLogValue: IUserAuditLogRawObject,
) => {
	expect(userAuditLogValue!.id).toBe(expectedUserAuditLogValue.id);
	expect(userAuditLogValue!.userId).toBe(expectedUserAuditLogValue.userId);
	expect(userAuditLogValue!.description).toBe(expectedUserAuditLogValue.description);
	expect(userAuditLogValue!.type.value).toBe(expectedUserAuditLogValue.type);
};

describe("Test UserAuditLogRepository getUserAuditLogsByIds", () => {
	let userAuditLogRepository: IUserAuditLogRepository;

	beforeAll(() => {
		userAuditLogRepository = new UserAuditLogRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve a user audit logs by Id", async () => {
		const seededUserAuditLogOne = await seedUserAuditLog({});
		const seededUserAuditLogTwo = await seedUserAuditLog({});

		const userAuditLogs = await userAuditLogRepository.getUserAuditLogsByIds([
			seededUserAuditLogOne.id,
			seededUserAuditLogTwo.id,
		]);

		assertUserAuditLog(userAuditLogs[0], seededUserAuditLogOne);
		assertUserAuditLog(userAuditLogs[1], seededUserAuditLogTwo);
	});

	it("should only retrieve existing user audit logs", async () => {
		const seededUserAuditLogOne = await seedUserAuditLog({});
		const seededUserAuditLogTwo = await seedUserAuditLog({});
		const seededUserAuditLogThree = "non-existing-user-id";

		const userAuditLogs = await userAuditLogRepository.getUserAuditLogsByIds([
			seededUserAuditLogOne.id,
			seededUserAuditLogTwo.id,
			seededUserAuditLogThree,
		]);

		assertUserAuditLog(userAuditLogs[0], seededUserAuditLogOne);
		assertUserAuditLog(userAuditLogs[1], seededUserAuditLogTwo);
		expect(userAuditLogs[2]).toBeUndefined();
	});

	it("should return null when given non-existing user id", async () => {
		const userAuditLogs = await userAuditLogRepository.getUserAuditLogsByIds([
			"non-existing-user-audit-log-id",
		]);

		expect(userAuditLogs).toEqual([]);
	});
});
