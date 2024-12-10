import type { GetRoleAuditLogsByPaginationDTO } from "@/modules/user/src/dtos/roleAuditLogDTO";
import { GetRoleAuditLogsByPaginationUseCase } from "@/modules/user/src/useCases/roleAuditLog/getRoleAuditLogsByPaginationUseCase";
import { db } from "@/shared/infrastructure/database";
import { seedRoleAuditLog } from "../../utils/roleAuditLog/seedRoleAuditLog";
import { seedUser } from "../../utils/user/seedUser";

describe("GetRoleAuditLogsByPaginationUseCase", () => {
	let getRoleAuditLogsByPaginationUseCase: GetRoleAuditLogsByPaginationUseCase;

	beforeAll(() => {
		getRoleAuditLogsByPaginationUseCase = new GetRoleAuditLogsByPaginationUseCase();
	});

	beforeEach(async () => {
		await db.roleAuditLog.deleteMany();
	});

	it("should return role audit logs with pagination", async () => {
		const seededUser = await seedUser({});
		const seededLog1 = await seedRoleAuditLog({});
		const seededLog2 = await seedRoleAuditLog({});
		const seededLog3 = await seedRoleAuditLog({});

		const request: GetRoleAuditLogsByPaginationDTO = {
			perPage: 2,
			page: 1,
			requestedById: seededUser.id,
		};

		const auditLogs = await getRoleAuditLogsByPaginationUseCase.execute(request);
		expect(auditLogs.auditLogs).toHaveLength(2);
		expect(auditLogs.page).toBe(1);
		expect(auditLogs.hasNextPage).toBe(true);
		expect(auditLogs.hasPreviousPage).toBe(false);
		expect(auditLogs.totalPages).toBe(2);

		const logIds = auditLogs.auditLogs.map((log) => log.id);
		expect(logIds).toEqual([seededLog1.id, seededLog2.id]);
		expect(logIds).not.toContain(seededLog3.id);
	});

	it("should return an empty list when no role audit logs exist", async () => {
		const seededUser = await seedUser({});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUser.id,
		};

		const auditLogs = await getRoleAuditLogsByPaginationUseCase.execute(request);

		expect(auditLogs.auditLogs).toHaveLength(0);
		expect(auditLogs.page).toBe(1);
		expect(auditLogs.hasNextPage).toBe(false);
		expect(auditLogs.totalPages).toBe(0);
	});
});
