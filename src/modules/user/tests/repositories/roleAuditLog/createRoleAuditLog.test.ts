import type { IRoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import { RoleAuditLogRepository } from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { createRoleAuditLogDomainObject } from "@/modules/user/tests/utils/roleAuditLog/createRoleAuditLogDomainObject";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "../../utils/user/seedUser";

const assertRoleAuditLog = (roleAuditLog: IRoleAuditLog, expectedRoleAuditLog: IRoleAuditLog) => {
	expect(roleAuditLog.id).toBe(expectedRoleAuditLog.id);
	expect(roleAuditLog.userId).toBe(expectedRoleAuditLog.userId);
	expect(roleAuditLog.typeValue).toBe(expectedRoleAuditLog.typeValue);
	expect(roleAuditLog.description).toBe(expectedRoleAuditLog.description);
	expect(roleAuditLog.roleId).toBe(expectedRoleAuditLog.roleId);
	expect(roleAuditLog.createdAt.toISOString()).toBe(expectedRoleAuditLog.createdAt.toISOString());
};

describe("RoleAuditLogRepository.createRoleAuditLog", () => {
	let roleAuditLogRepository: RoleAuditLogRepository;

	beforeAll(async () => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should create role audit log successfully", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});
		const domainRoleAuditLog = createRoleAuditLogDomainObject({
			userId: seededUser.id,
			roleId: seededRole.id,
		});

		const createdRoleAuditLog = await roleAuditLogRepository.createRoleAuditLog(domainRoleAuditLog);

		expect(createdRoleAuditLog).not.toBeNull();
		assertRoleAuditLog(createdRoleAuditLog!, domainRoleAuditLog);

		const roleAuditLog = await roleAuditLogRepository.getRoleAuditLogById(domainRoleAuditLog.id);

		expect(createdRoleAuditLog).not.toBeNull();
		assertRoleAuditLog(roleAuditLog!, domainRoleAuditLog);
	});
});
