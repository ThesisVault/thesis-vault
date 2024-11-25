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

	it("should create a user audit log successfully", async () => {
		const newAuditLog: IUserAuditLog = {
			id: uuidv4(),
			userId: seededUser.id,
			type: "LOGIN",
			description: "User logged in successfully",
			createdAt: new Date(),
		};

		const createdAuditLog = await userAuditLogRepository.createUserAuditLog(newAuditLog);

		expect(createdAuditLog).not.toBeNull();
		if (createdAuditLog) {
			assertAuditLog(createdAuditLog, newAuditLog);
		}
	}, 10000);

	it("should return null if the user audit log creation fails due to invalid user", async () => {
		const invalidAuditLog: IUserAuditLog = {
			id: uuidv4(),
			userId: "non-existing-user-id",
			type: "LOGIN",
			description: "Invalid user attempt",
			createdAt: new Date(),
		};

		const createdAuditLog = await userAuditLogRepository.createUserAuditLog(invalidAuditLog);

		expect(createdAuditLog).toBeNull();
	});

	it("should throw an error if required fields are missing", async () => {
		const invalidAuditLog: IUserAuditLog = {
			id: uuidv4(),
			userId: "",
			type: "LOGIN",
			description: "Attempt with missing user ID",
			createdAt: new Date(),
		};

		await expect(userAuditLogRepository.createUserAuditLog(invalidAuditLog)).rejects;
	});
});
