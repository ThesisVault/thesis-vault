import { UserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { db } from "@/shared/infrastructure/database";
import { seedUserAuditLog } from "../../utils/userAuditLog/seedUserAuditLog";

describe("GetUserAuditLogsWithPagination", () => {
	let userAuditLogRepository: UserAuditLogRepository;

	beforeAll(() => {
		userAuditLogRepository = new UserAuditLogRepository();
	});

	beforeEach(async () => {
		await db.userAuditLog.deleteMany();
		await db.user.deleteMany();
	});

	it("should return paginated user audit logs", async () => {
		const seededLogOne = await seedUserAuditLog({});
		const seededLogTwo = await seedUserAuditLog({});

		const result = await userAuditLogRepository.getUserAuditLogsWithPagination({
			skip: 0,
			size: 2,
		});

		const logIds = result.map((log) => log.id);

		expect(logIds).toEqual([seededLogOne.id, seededLogTwo.id]);
		expect(result.length).toBe(2);
	});

	it("should return an empty list if no user audit logs exist", async () => {
		const result = await userAuditLogRepository.getUserAuditLogsWithPagination({
			skip: 0,
			size: 2,
		});

		expect(result).toEqual([]);
	});
});
