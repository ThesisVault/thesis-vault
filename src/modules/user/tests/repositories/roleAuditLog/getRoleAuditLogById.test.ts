import { RoleAuditLogRepository } from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";
import { db } from "@/shared/infrastructure/database";

describe("RoleAuditLogRepository.getRoleAuditLogById", () => {
	let roleAuditLogRepository: RoleAuditLogRepository;

	beforeAll(async () => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve an existing roleAuditLog by ID", async () => {
		const seededRoleAuditLog = await seedRoleAuditLog({});
		const roleAuditLog = await roleAuditLogRepository.getRoleAuditLogById(seededRoleAuditLog.id);

		expect(roleAuditLog!.id).toBe(seededRoleAuditLog.id);
		expect(roleAuditLog!.userId).toBe(seededRoleAuditLog.userId);
		expect(roleAuditLog!.typeValue).toBe(seededRoleAuditLog.type);
		expect(roleAuditLog!.description).toBe(seededRoleAuditLog.description);
		expect(roleAuditLog!.createdAt.toISOString()).toBe(seededRoleAuditLog.createdAt.toISOString());
	});

	it("should return null when audit log does not exist", async () => {
		const auditLog = await roleAuditLogRepository.getRoleAuditLogById("non-existing-id");

		expect(auditLog).toBeNull();
	});
});
