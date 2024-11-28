import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogDescription } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogDescription";
import { UserAuditLogType } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogType";
import { UserAuditLogService } from "@/modules/user/src/domain/services/userAuditLogService";
import type { IUserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { faker } from "@faker-js/faker";

const mockRepository: jest.Mocked<IUserAuditLogRepository> = {
	getUserAuditLogById: jest.fn(),
	getUserAuditLogsByUserId: jest.fn(),
	createUserAuditLog: jest.fn(),
	createUserAuditLogs: jest.fn(),
};

const userAuditLogService = new UserAuditLogService(mockRepository);

describe("UserAuditLogService", () => {
	const mockAuditLog: IUserAuditLog = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: UserAuditLogType.create("CREATE").getValue(),
		description: UserAuditLogDescription.create("User created successfully").getValue(),
		createdAt: new Date(),
	};

	describe("getUserAuditLogById", () => {
		it("should return an audit log when found", async () => {
			mockRepository.getUserAuditLogById.mockResolvedValue(mockAuditLog);

			const result = await userAuditLogService.getUserAuditLogById(mockAuditLog.id);

			expect(mockRepository.getUserAuditLogById).toHaveBeenCalledWith(mockAuditLog.id);
			expect(result).toEqual(mockAuditLog);
		});

		it("should return null when no audit log is found", async () => {
			mockRepository.getUserAuditLogById.mockResolvedValue(null);

			const result = await userAuditLogService.getUserAuditLogById(faker.string.uuid());

			expect(result).toBeNull();
		});
	});

	describe("getUserAuditLogsByUserId", () => {
		it("should return an array of audit logs for a user", async () => {
			const mockLogs = [mockAuditLog, { ...mockAuditLog, id: faker.string.uuid() }];
			mockRepository.getUserAuditLogsByUserId.mockResolvedValue(mockLogs);

			const result = await userAuditLogService.getUserAuditLogsByUserId(mockAuditLog.userId);

			expect(mockRepository.getUserAuditLogsByUserId).toHaveBeenCalledWith(mockAuditLog.userId);
			expect(result).toEqual(mockLogs);
		});

		it("should return an empty array when no logs are found", async () => {
			mockRepository.getUserAuditLogsByUserId.mockResolvedValue([]);

			const result = await userAuditLogService.getUserAuditLogsByUserId(faker.string.uuid());

			expect(result).toEqual([]);
		});
	});

	describe("createUserAuditLog", () => {
		it("should create and return the created audit log", async () => {
			mockRepository.createUserAuditLog.mockResolvedValue(mockAuditLog);

			const result = await userAuditLogService.createUserAuditLog(mockAuditLog);

			expect(mockRepository.createUserAuditLog).toHaveBeenCalledWith(mockAuditLog);
			expect(result).toEqual(mockAuditLog);
		});

		it("should return null when creation fails", async () => {
			mockRepository.createUserAuditLog.mockResolvedValue(null);

			const result = await userAuditLogService.createUserAuditLog(mockAuditLog);

			expect(result).toBeNull();
		});
	});

	describe("createUserAuditLogs", () => {
		it("should create and return an array of audit logs", async () => {
			const mockLogs = [mockAuditLog, { ...mockAuditLog, id: faker.string.uuid() }];
			mockRepository.createUserAuditLogs.mockResolvedValue(mockLogs);

			const result = await userAuditLogService.createUserAuditLogs(mockLogs);

			expect(mockRepository.createUserAuditLogs).toHaveBeenCalledWith(mockLogs);
			expect(result).toEqual(mockLogs);
		});

		it("should return an empty array when creation fails", async () => {
			mockRepository.createUserAuditLogs.mockResolvedValue([]);

			const result = await userAuditLogService.createUserAuditLogs([]);

			expect(result).toEqual([]);
		});
	});
});
