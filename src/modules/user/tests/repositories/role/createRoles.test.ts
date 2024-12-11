import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { createRoleDomainObject } from "../../utils/role/createRoleDomainObject";

const assertRole = (role: IRole, expectedRole: IRole) => {
	expect(role.id).toBe(expectedRole.id);
	expect(role.nameValue).toBe(expectedRole.nameValue);
	expect(role.color).toBe(expectedRole.color);
	expect(role.permissionsValue).toBe(expectedRole.permissionsValue);
	expect(role.createdAt.toString).toBe(expectedRole.createdAt.toString);
	expect(role.deletedAt).toBe(expectedRole.deletedAt);
	expect(role.isDeleted).toBe(expectedRole.isDeleted);
	expect(role.updatedAt).toBe(expectedRole.updatedAt);
};

describe("Test User Audit Log Repository createUserAuditLogs", () => {
	let roleRepository: IRoleRepository;

	beforeAll(async () => {
		roleRepository = new RoleRepository();
	});

	it("should create multiple user audit logs successfully", async () => {
		const roleDomainObject = createRoleDomainObject({
			updatedAt: null,
			deletedAt: null,
		});
		const roleDomainObject2 = createRoleDomainObject({
			updatedAt: null,
			deletedAt: null,
		});
		const createdRoles = await roleRepository.createRoles([roleDomainObject, roleDomainObject2]);

		assertRole(createdRoles[0], roleDomainObject);
		assertRole(createdRoles[1], roleDomainObject2);

		const userAuditLogs = await roleRepository.getRolesByIds([
			roleDomainObject.id,
			roleDomainObject2.id,
		]);

		assertRole(userAuditLogs[0], roleDomainObject);
		assertRole(userAuditLogs[1], roleDomainObject2);
	});
});
