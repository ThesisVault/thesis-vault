import type { GetUserAuditLogsWithPaginationDTO } from "@/modules/user/src/dtos/userAuditLogDTO";
import { GetUserAuditLogsWithPaginationUseCase } from "@/modules/user/src/useCases/userAuditLog/getUserAuditLogsWithPaginationUseCase";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "../../utils/user/seedUser";
import { seedUserAuditLog } from "../../utils/userAuditLog/seedUserAuditLog";

describe("GetUserAuditLogsWithPaginationUseCase", () => {
	let getUserAuditLogsWithPaginationUseCase: GetUserAuditLogsWithPaginationUseCase;

	beforeAll(() => {
		getUserAuditLogsWithPaginationUseCase = new GetUserAuditLogsWithPaginationUseCase();
	});

	beforeEach(async () => {
		await db.userAuditLog.deleteMany();
	});

	it("should return user audit logs with pagination", async () => {
		const seededUser = await seedUser({});
		const seededLog1 = await seedUserAuditLog({ userId: seededUser.id });
		const seededLog2 = await seedUserAuditLog({ userId: seededUser.id });
		const seededLog3 = await seedUserAuditLog({ userId: seededUser.id });

		const request: GetUserAuditLogsWithPaginationDTO = {
			perPage: 2,
			page: 1,
			requestedById: seededUser.id,
		};

		const audiLogs = await getUserAuditLogsWithPaginationUseCase.execute(request);
		expect(audiLogs.logs).toHaveLength(2);
		expect(audiLogs.page).toBe(1);
		expect(audiLogs.hasNextPage).toBe(true);
		expect(audiLogs.hasPreviousPage).toBe(false);
		expect(audiLogs.totalPages).toBe(2);

		const logIds = audiLogs.logs.map((log) => log.id);
		expect(logIds).toEqual([seededLog1.id, seededLog2.id]);
		expect(logIds).not.toContain(seededLog3);
	});

	it("should return an empty list when no user audit logs exist", async () => {
		const seededUser = await seedUser({});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUser.id,
		};

		const auditLogs = await getUserAuditLogsWithPaginationUseCase.execute(request);

		expect(auditLogs.logs).toHaveLength(0);
		expect(auditLogs.page).toBe(1);
		expect(auditLogs.hasNextPage).toBe(false);
		expect(auditLogs.totalPages).toBe(0);
	});
});
