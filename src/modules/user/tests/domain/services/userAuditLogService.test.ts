import { UserAuditLogService } from "@/modules/user/src/domain/services/userAuditLogService";
import { UserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("UserAuditLogService", () => {
	let userAuditLogService: UserAuditLogService;
	let userAuditLogRepository: UserAuditLogRepository;

	beforeAll(() => {
		userAuditLogRepository = new UserAuditLogRepository();
		userAuditLogService = new UserAuditLogService();
	});

	it("should successfully create an audit log", async () => {
		const seededUser = await seedUser({});
		const params = {
			userId: seededUser.id,
			type: "DELETE",
			description: "User account deleted",
		};

		await userAuditLogService.createAndSaveUserAuditLog(params);

		const userAuditLogs = await userAuditLogRepository.getUserAuditLogsByUserId(seededUser.id);

		expect(userAuditLogs).toHaveLength(1);
		expect(userAuditLogs[0].userId).toBe(params.userId);
		expect(userAuditLogs[0].typeValue).toBe(params.type);
		expect(userAuditLogs[0].description).toBe(params.description);
		expect(userAuditLogs[0].createdAt).toBeInstanceOf(Date);
	});
});
