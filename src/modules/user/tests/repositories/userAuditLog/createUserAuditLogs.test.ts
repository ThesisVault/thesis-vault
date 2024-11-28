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

	it("should create multiple user audit logs successfully", async () => {
		const descriptionResult = UserAuditLogDescription.create(seededLog.description);
		expect(descriptionResult.isSuccess).toBe(true);
		const descriptionInstance = descriptionResult.getValue();

		const typeResult = UserAuditLogType.create(seededLog.type);
		expect(typeResult.isSuccess).toBe(true);
		const typeInstance = typeResult.getValue();

		const newAuditLogs: IUserAuditLog[] = [
			{
				id: uuid(),
				userId: seededLog.userId,
				type: typeInstance,
				description: descriptionInstance,
				createdAt: seededLog.createdAt,
			},
			{
				id: uuid(),
				userId: seededLog.userId,
				type: typeInstance,
				description: descriptionInstance,
				createdAt: seededLog.createdAt,
			},
		];

		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs(newAuditLogs);

		expect(createdAuditLogs).toHaveLength(newAuditLogs.length);

		assertAuditLog(createdAuditLogs[0], newAuditLogs[0]);
		assertAuditLog(createdAuditLogs[1], newAuditLogs[1]);
	});

	it("should return an empty array if no audit logs are provided", async () => {
		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs([]);
		expect(createdAuditLogs).toHaveLength(0);
	});

	it("should handle and return an empty array if user audit log creation fails", async () => {
		jest.spyOn(userAuditLogRepository, "createUserAuditLogs").mockResolvedValueOnce([]);

		const descriptionResult = UserAuditLogDescription.create(seededLog.description);
		expect(descriptionResult.isSuccess).toBe(true);
		const descriptionInstance = descriptionResult.getValue();

		const typeResult = UserAuditLogType.create(seededLog.type);
		expect(typeResult.isSuccess).toBe(true);
		const typeInstance = typeResult.getValue();

		const invalidAuditLogs: IUserAuditLog[] = [
			{
				id: uuid(),
				userId: "non-existing-user-id",
				type: typeInstance,
				description: descriptionInstance,
				createdAt: seededLog.createdAt,
			},
		];

		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs(invalidAuditLogs);

		expect(createdAuditLogs).toHaveLength(0);
	});

	it("should create user audit logs with unique ids", async () => {
		const descriptionResult = UserAuditLogDescription.create(seededLog.description);
		expect(descriptionResult.isSuccess).toBe(true);
		const descriptionInstance = descriptionResult.getValue();

		const typeResult = UserAuditLogType.create(seededLog.type);
		expect(typeResult.isSuccess).toBe(true);
		const typeInstance = typeResult.getValue();

		const newAuditLogs: IUserAuditLog[] = [
			{
				id: uuid(),
				userId: seededLog.userId,
				type: typeInstance,
				description: descriptionInstance,
				createdAt: seededLog.createdAt,
			},
			{
				id: uuid(),
				userId: seededLog.userId,
				type: typeInstance,
				description: descriptionInstance,
				createdAt: seededLog.createdAt,
			},
		];

		const createdAuditLogs = await userAuditLogRepository.createUserAuditLogs(newAuditLogs);

		expect(createdAuditLogs).toHaveLength(newAuditLogs.length);
		expect(createdAuditLogs[0].id).not.toBe(createdAuditLogs[1].id);
	});
});
