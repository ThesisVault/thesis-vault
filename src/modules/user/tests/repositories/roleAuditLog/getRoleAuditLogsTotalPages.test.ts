import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";
import { db } from "@/shared/infrastructure/database";

describe("RoleAuditLogRepository.getRoleAuditLogsTotalPages", () => {
	let roleAuditLogRepository: IRoleAuditLogRepository;

	beforeAll(async () => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	beforeEach(async () => {
		await db.roleAuditLog.deleteMany();
	});

	it("should return correct total pages available", async () => {
		await seedRoleAuditLog({});
		await seedRoleAuditLog({});
		await seedRoleAuditLog({});

		const totalPages = await roleAuditLogRepository.getRoleAuditLogsTotalPages(2);

		expect(totalPages).toBe(2);
	});

	it("should return 0 when no roleAuditLog exist", async () => {
		const totalPages = await roleAuditLogRepository.getRoleAuditLogsTotalPages(1);

		expect(totalPages).toBe(0);
	});
});
