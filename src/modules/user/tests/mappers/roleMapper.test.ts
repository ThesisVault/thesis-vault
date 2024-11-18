import { Role } from "@/modules/user/src/domain/models/role/classes/role";
import { RoleMapper } from "@/modules/user/src/mappers/roleMapper";
import { createRoleDomainObject } from "@/modules/user/tests/utils/role/createRoleDomainObject";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";

describe("RoleMapper", () => {
	it("should map to domain from persistence data", async () => {
		const roleSchemaObject = await seedRole({});
		const roleDomainObject = RoleMapper.toDomain(roleSchemaObject);

		expect(roleDomainObject).toBeInstanceOf(Role);
		expect(roleDomainObject.id).toBe(roleSchemaObject.id);
		expect(roleDomainObject.nameValue).toBe(roleSchemaObject.name);
		expect(roleDomainObject.permissionsValue).toBe(roleSchemaObject.permissions);
	});

	it("should map to persistence from domain", () => {
		const roleDomainObject = createRoleDomainObject({});
		const roleSchemaObject = RoleMapper.toPersistence(roleDomainObject);

		expect(roleSchemaObject.id).toBe(roleDomainObject.id);
		expect(roleSchemaObject.name).toBe(roleDomainObject.nameValue);
		expect(roleSchemaObject.permissions).toBe(roleDomainObject.permissionsValue);
		expect(roleSchemaObject.createdAt).toBe(roleDomainObject.createdAt);
		expect(roleSchemaObject.updatedAt).toBe(roleDomainObject.updatedAt);
	});
});
