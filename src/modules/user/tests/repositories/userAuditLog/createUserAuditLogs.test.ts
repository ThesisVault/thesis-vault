import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";
import { v4 as uuidv4 } from "uuid";
//
const assertAuditLog = (auditLog: IUserAuditLog, expectedLog: IUserAuditLog) => {
	expect(auditLog.id).toBe(expectedLog.id);
	expect(auditLog.userId).toBe(expectedLog.userId);
	expect(auditLog.type).toBe(expectedLog.type);
	expect(auditLog.description).toBe(expectedLog.description);
	expect(auditLog.createdAt.toISOString()).toBe(expectedLog.createdAt.toISOString());
};

describe("UserAuditLogRepository Tests", () => {
	let userAuditLogRepository: UserAuditLogRepository;
	let seededUser: { id: string };

	beforeAll(async () => {
		userAuditLogRepository = new UserAuditLogRepository();
		seededUser = await seedUser({});
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should create multiple user audit logs successfully", async () => {
		const newAuditLogs: IUserAuditLog[] = [
			{
				id: uuidv4(),
				userId: seededUser.id,
				type: "LOGIN",
				description: "User logged in successfully",
				createdAt: new Date(),
			},
			{
				id: uuidv4(),
				userId: seededUser.id,
				type: "LOGOUT",
				description: "User logged out successfully",
				createdAt: new Date(),
			},
		];

		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs(newAuditLogs);

		expect(createdAuditLogs).toHaveLength(newAuditLogs.length);

		createdAuditLogs.forEach((createdAuditLog, index) => {
			assertAuditLog(createdAuditLog, newAuditLogs[index]);
		});
	}, 10000);

	it("should return an empty array if no audit logs are provided", async () => {
		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs([]);
		expect(createdAuditLogs).toHaveLength(0);
	});

	it("should handle and return an empty array if user audit log creation fails", async () => {
		jest.spyOn(userAuditLogRepository, "createUserAuditLogs").mockResolvedValueOnce([]);

		const invalidAuditLogs: IUserAuditLog[] = [
			{
				id: uuidv4(),
				userId: "non-existing-user-id",
				type: "LOGIN",
				description: "Invalid user attempt",
				createdAt: new Date(),
			},
		];

		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs(invalidAuditLogs);

		expect(createdAuditLogs).toHaveLength(0);
	});

	it("should create user audit logs with unique ids", async () => {
		const newAuditLogs: IUserAuditLog[] = [
			{
				id: uuidv4(),
				userId: seededUser.id,
				type: "LOGIN",
				description: "User logged in successfully",
				createdAt: new Date(),
			},
			{
				id: uuidv4(),
				userId: seededUser.id,
				type: "PASSWORD_CHANGE",
				description: "User changed password",
				createdAt: new Date(),
			},
		];

		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs(newAuditLogs);

		expect(createdAuditLogs).toHaveLength(newAuditLogs.length);
		expect(createdAuditLogs[0].id).not.toBe(createdAuditLogs[1].id);
	});
});
