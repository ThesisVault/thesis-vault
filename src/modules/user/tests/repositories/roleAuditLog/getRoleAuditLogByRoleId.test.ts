import { RoleAuditLogRepository } from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";

describe("RoleAuditLogRepository.getRoleAuditLogByRoleIds", () => {
	let roleAuditLogRepository: RoleAuditLogRepository;

	beforeAll(async () => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	it("should retrieve an existing roleAuditLog by roleId", async () => {
		const seededRoleAuditLog = await seedRoleAuditLog({});

		const roleAuditLog = await roleAuditLogRepository.getRoleAuditLogByRoleId(
			seededRoleAuditLog.roleId,
		);

		expect(roleAuditLog).not.toBeNull();
		expect(roleAuditLog!.id).toBe(seededRoleAuditLog.id);
		expect(roleAuditLog!.userId).toBe(seededRoleAuditLog.userId);
		expect(roleAuditLog!.typeValue).toBe(seededRoleAuditLog.type);
		expect(roleAuditLog!.description).toBe(seededRoleAuditLog.description);
		expect(roleAuditLog!.createdAt.toISOString()).toBe(seededRoleAuditLog.createdAt.toISOString());
	});

	it("should return null when roleAuditLog with given roleId does not exist", async () => {
		const auditLog = await roleAuditLogRepository.getRoleAuditLogByRoleId("non-existing-id");

		expect(auditLog).toBeNull();
	});
});
