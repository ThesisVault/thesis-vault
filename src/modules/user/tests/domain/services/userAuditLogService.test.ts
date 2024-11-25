import {
	type IUserAuditLogService,
	UserAuditLogService,
} from "@/modules/user/src/domain/services/userAuditLogService";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { createUserAuditLogDomainObject } from "@/modules/user/tests/utils/userAuditLog/createUserAuditLogDO"; // Import the utility
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { db } from "@/shared/infrastructure/database";

describe("Test UserAuditLogService", () => {
	let userAuditLogService: IUserAuditLogService;

	beforeAll(() => {
		userAuditLogService = new UserAuditLogService();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	describe("getUserAuditLogById", () => {
		it("should return an audit log when it exists", async () => {
			const seededLog = await seedUserAuditLog({});
			const fetchedLog = await userAuditLogService.getUserAuditLogById(seededLog.id);
			expect(fetchedLog).toBeTruthy();
			expect(fetchedLog?.id).toBe(seededLog.id);
		});

		it("should return null if no audit log exists with the given ID", async () => {
			const fetchedLog = await userAuditLogService.getUserAuditLogById("non-existent-id");
			expect(fetchedLog).toBeNull();
		});
	});

	describe("getUserAuditLogsByUserId", () => {
		it("should return audit logs for a specific user", async () => {
			const seededUser = await seedUser({});
			const logs = [
				await seedUserAuditLog({ userId: seededUser.id }),
				await seedUserAuditLog({ userId: seededUser.id }),
			];

			const fetchedLogs = await userAuditLogService.getUserAuditLogsByUserId(seededUser.id);
			expect(fetchedLogs).toHaveLength(logs.length);

			for (const log of logs) {
				expect(fetchedLogs).toContainEqual(expect.objectContaining({ id: log.id }));
			}
		});

		it("should return an empty array if no logs exist for a user", async () => {
			const fetchedLogs =
				await userAuditLogService.getUserAuditLogsByUserId("non-existent-user-id");
			expect(fetchedLogs).toHaveLength(0);
		});
	});

	describe("createUserAuditLog", () => {
		it("should create and return a new audit log", async () => {
			const seededUser = await seedUser({});

			const newLog = createUserAuditLogDomainObject({
				userId: seededUser.id,
				type: "LOGIN",
				description: "User logged in",
			});

			const createdLog = await userAuditLogService.createUserAuditLog(newLog);

			expect(createdLog).toBeTruthy();
			expect(createdLog?.id).toBeDefined();
			expect(createdLog?.userId).toBe(newLog.userId);
			expect(createdLog?.type).toBe(newLog.type);
			expect(createdLog?.description).toBe(newLog.description);
		});
	});

	describe("createUserAuditLogs", () => {
		it("should create multiple audit logs", async () => {
			const seededUser = await seedUser({});
			const logs = [
				createUserAuditLogDomainObject({
					userId: seededUser.id,
					type: "LOGIN",
					description: "User logged in",
				}),
				createUserAuditLogDomainObject({
					userId: seededUser.id,
					type: "LOGOUT",
					description: "User logged out",
				}),
			];

			const createdLogs = await userAuditLogService.createUserAuditLogs(logs);

			expect(createdLogs).toHaveLength(logs.length);

			for (const log of logs) {
				expect(createdLogs).toContainEqual(
					expect.objectContaining({ description: log.description }),
				);
			}
		});
	});
});
