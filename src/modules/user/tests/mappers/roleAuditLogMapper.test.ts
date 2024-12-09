import { RoleAuditLogMapper } from "@/modules/user/src/mappers/roleAuditLogMapper";
import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import { createRoleAuditLogDomainObject } from "@/modules/user/tests/utils/roleAuditLog/createRoleAuditLogDomainObject";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";

describe("RoleAuditLogMapper", () => {
	it("should map roleAuditLog persistence into roleAuditLog domain", async () => {
		const seededRoleAuditLog = await seedRoleAuditLog({});
		const roleDomainObject = RoleAuditLogMapper.toDomain(seededRoleAuditLog);

		expect(seededRoleAuditLog.id).toBe(roleDomainObject.id);
		expect(seededRoleAuditLog.userId).toBe(roleDomainObject.userId);
		expect(seededRoleAuditLog.type).toBe(roleDomainObject.type.value);
		expect(seededRoleAuditLog.description).toBe(roleDomainObject.description);
		expect(seededRoleAuditLog.createdAt).toStrictEqual(roleDomainObject.createdAt);
	});

	it("should map roleAuditLog domain into roleAuditLog persistence", () => {
		const roleAuditLogDomain = createRoleAuditLogDomainObject({});
		const roleAuditLogPersistence = UserAuditLogMapper.toPersistence(roleAuditLogDomain);

		expect(roleAuditLogDomain.id).toBe(roleAuditLogPersistence.id);
		expect(roleAuditLogDomain.userId).toBe(roleAuditLogPersistence.userId);
		expect(roleAuditLogDomain.type.value).toBe(roleAuditLogPersistence.type);
		expect(roleAuditLogDomain.description).toBe(roleAuditLogPersistence.description);
		expect(roleAuditLogDomain.createdAt).toStrictEqual(roleAuditLogPersistence.createdAt);
	});
});
