import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogDescription } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogDescription";
import { UserAuditLogType } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogType";
import { UserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { db } from "@/shared/infrastructure/database";
import { v4 as uuid } from "uuid";
import { seedUserAuditLog } from "../../utils/userAuditLog/seedUserAuditLog";

const assertAuditLog = (auditLog: IUserAuditLog, expectedLog: IUserAuditLog) => {
	expect(auditLog.id).toBe(expectedLog.id);
	expect(auditLog.userId).toBe(expectedLog.userId);
	expect(auditLog.type.value).toBe(expectedLog.type.value);
	expect(auditLog.description.value).toBe(expectedLog.description.value);
	expect(auditLog.createdAt.toISOString()).toBe(expectedLog.createdAt.toISOString());
};

describe("UserAuditLogRepository Tests", () => {
	let userAuditLogRepository: UserAuditLogRepository;
	let seededLog: { userId: string; type: string; description: string; createdAt: Date };

	beforeAll(async () => {
		userAuditLogRepository = new UserAuditLogRepository();
		seededLog = await seedUserAuditLog({});
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should create a user audit log successfully", async () => {
		const descriptionResult = UserAuditLogDescription.create(seededLog.description);
		expect(descriptionResult.isSuccess).toBe(true);
		const descriptionInstance = descriptionResult.getValue();

		const typeResult = UserAuditLogType.create(seededLog.type);
		expect(typeResult.isSuccess).toBe(true);
		const typeInstance = typeResult.getValue();

		const newAuditLog: IUserAuditLog = {
			id: uuid(),
			userId: seededLog.userId,
			type: typeInstance,
			description: descriptionInstance,
			createdAt: seededLog.createdAt,
		};

		const createdAuditLog = await userAuditLogRepository.createUserAuditLog(newAuditLog);
		expect(createdAuditLog).not.toBeNull();
		assertAuditLog(createdAuditLog!, newAuditLog);
	});

	it("should return null if the user audit log creation fails due to invalid user", async () => {
		const descriptionResult = UserAuditLogDescription.create(seededLog.description);
		expect(descriptionResult.isSuccess).toBe(true);
		const descriptionInstance = descriptionResult.getValue();

		const typeResult = UserAuditLogType.create(seededLog.type);
		expect(typeResult.isSuccess).toBe(true);
		const typeInstance = typeResult.getValue();

		const invalidAuditLog: IUserAuditLog = {
			id: uuid(),
			userId: "non-existing-user-id",
			type: typeInstance,
			description: descriptionInstance,
			createdAt: seededLog.createdAt,
		};

		const createdAuditLog = await userAuditLogRepository.createUserAuditLog(invalidAuditLog);
		expect(createdAuditLog).toBeNull();
	});

	it("should throw an error if required fields are missing", async () => {
		const descriptionResult = UserAuditLogDescription.create(seededLog.description);
		expect(descriptionResult.isSuccess).toBe(true);
		const descriptionInstance = descriptionResult.getValue();

		const typeResult = UserAuditLogType.create(seededLog.type);
		expect(typeResult.isSuccess).toBe(true);
		const typeInstance = typeResult.getValue();

		const invalidAuditLog: IUserAuditLog = {
			id: uuid(),
			userId: "",
			type: typeInstance,
			description: descriptionInstance,
			createdAt: seededLog.createdAt,
		};

		await expect(userAuditLogRepository.createUserAuditLog(invalidAuditLog)).rejects.toThrowError(
			"User ID cannot be empty",
		);
	});
});
