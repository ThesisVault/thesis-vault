import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import { createUserAuditLogDomainObject } from "../utils/userAuditLog/createUserAuditLogDomainObject";
import { seedUserAuditLog } from "../utils/userAuditLog/seedUserAuditLog";

describe("UserAuditLogMapper", () => {
	it("should map to domain from persistence data", async () => {
		const userAuditLogSchemaObject = await seedUserAuditLog({});
		const userAuditLogDomainObject = UserAuditLogMapper.toDomain(userAuditLogSchemaObject);

		expect(userAuditLogSchemaObject.id).toBe(userAuditLogDomainObject.id);
		expect(userAuditLogSchemaObject.userId).toBe(userAuditLogDomainObject.userId);
		expect(userAuditLogSchemaObject.type).toBe(userAuditLogDomainObject.type.value);
		expect(userAuditLogSchemaObject.description).toBe(userAuditLogDomainObject.description);
		expect(userAuditLogSchemaObject.createdAt).toStrictEqual(userAuditLogDomainObject.createdAt);
	});

	it("should map to persistence from domain", () => {
		const userAuditLogDomainObject = createUserAuditLogDomainObject({});
		const userAuditLogSchemaObject = UserAuditLogMapper.toPersistence(userAuditLogDomainObject);

		expect(userAuditLogDomainObject.id).toBe(userAuditLogSchemaObject.id);
		expect(userAuditLogDomainObject.userId).toBe(userAuditLogSchemaObject.userId);
		expect(userAuditLogDomainObject.type.value).toBe(userAuditLogSchemaObject.type);
		expect(userAuditLogDomainObject.description).toBe(userAuditLogSchemaObject.description);
		expect(userAuditLogDomainObject.createdAt).toStrictEqual(userAuditLogSchemaObject.createdAt);
	});
});
