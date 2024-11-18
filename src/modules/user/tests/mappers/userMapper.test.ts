import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { createUserDomainObject } from "@/modules/user/tests/utils/user/createUserDomainObject";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("UserMapper", () => {
	it("should map to domain from persistence data", async () => {
		const userSchemaObject = await seedUser({});
		const userDomainObject = UserMapper.toDomain(userSchemaObject);

		expect(userDomainObject).toBeInstanceOf(User);
		expect(userDomainObject.id).toBe(userSchemaObject.id);
		expect(userDomainObject.nameValue).toBe(userSchemaObject.name);
		expect(userDomainObject.roleId).toBe(userSchemaObject.roleId);
		expect(userDomainObject.isSuperAdmin).toBe(userSchemaObject.isSuperAdmin);
		expect(userDomainObject.allowPermissionsValue).toBe(userSchemaObject.allowPermissions);
		expect(userDomainObject.denyPermissionsValue).toBe(userSchemaObject.denyPermissions);
	});

	it("should map to persistence from domain", () => {
		const userDomainObject = createUserDomainObject({});
		const userSchemaObject = UserMapper.toPersistence(userDomainObject);

		expect(userSchemaObject.id).toBe(userDomainObject.id);
		expect(userSchemaObject.name).toBe(userDomainObject.nameValue);
		expect(userSchemaObject.isSuperAdmin).toBe(userDomainObject.isSuperAdmin);
		expect(userSchemaObject.allowPermissions).toBe(userDomainObject.allowPermissionsValue);
		expect(userSchemaObject.denyPermissions).toBe(userDomainObject.denyPermissionsValue);
	});
});
