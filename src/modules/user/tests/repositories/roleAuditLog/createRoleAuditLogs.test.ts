import type { IRoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import { RoleAuditLogRepository } from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { createRoleAuditLogDomainObject } from "@/modules/user/tests/utils/roleAuditLog/createRoleAuditLogDomainObject";
import { seedUser } from "../../utils/user/seedUser";

const assertRoleAuditLog = (roleAuditLog: IRoleAuditLog, expectedRoleAuditLog: IRoleAuditLog) => {
	expect(roleAuditLog.id).toBe(expectedRoleAuditLog.id);
	expect(roleAuditLog.userId).toBe(expectedRoleAuditLog.userId);
	expect(roleAuditLog.typeValue).toBe(expectedRoleAuditLog.typeValue);
	expect(roleAuditLog.description).toBe(expectedRoleAuditLog.description);
	expect(roleAuditLog.roleId).toBe(expectedRoleAuditLog.roleId);
	expect(roleAuditLog.createdAt.toISOString()).toBe(expectedRoleAuditLog.createdAt.toISOString());
};

describe("RoleAuditLogRepository.createRoleAuditLogs", () => {
	let roleAuditLogRepository: RoleAuditLogRepository;

	beforeAll(async () => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	it("should create multiple user audit logs successfully", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});
		const domainRoleAuditLog = createRoleAuditLogDomainObject({
			userId: seededUser.id,
			roleId: seededRole.id,
		});
		const domainRoleAuditLogTwo = createRoleAuditLogDomainObject({
			userId: seededUser.id,
			roleId: seededRole.id,
		});

		const createdRoleAuditLogs = await roleAuditLogRepository.createRoleAuditLogs([
			domainRoleAuditLog,
			domainRoleAuditLogTwo,
		]);

		expect(createdRoleAuditLogs.length).toBe(2);
		assertRoleAuditLog(createdRoleAuditLogs[0], domainRoleAuditLog);
		assertRoleAuditLog(createdRoleAuditLogs[1], domainRoleAuditLogTwo);

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByIds([
			domainRoleAuditLog.id,
			domainRoleAuditLogTwo.id,
		]);

		expect(createdRoleAuditLogs.length).toBe(2);
		assertRoleAuditLog(roleAuditLogs[0], domainRoleAuditLog);
		assertRoleAuditLog(roleAuditLogs[1], domainRoleAuditLogTwo);
	});
});
