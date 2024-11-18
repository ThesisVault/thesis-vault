import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import type { IRoleRawObject } from "@/modules/user/src/domain/models/role/shared/constant";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { db } from "@/shared/infrastructure/database";

const assertRole = (roleValue: IRole, expectedRoleValue: IRoleRawObject) => {
	expect(roleValue!.id).toBe(expectedRoleValue.id);
	expect(roleValue!.nameValue).toBe(expectedRoleValue.name);
	expect(roleValue!.permissionsValue).toBe(expectedRoleValue.permissions);
};

describe("Test Role Repository getRolesByIds", () => {
	let roleRepository: IRoleRepository;

	beforeAll(async () => {
		roleRepository = new RoleRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve a roles by ids", async () => {
		const seededRoleOne = await seedRole({});
		const seededRoleTwo = await seedRole({});

		const roles = await roleRepository.getRolesByIds([seededRoleOne.id, seededRoleTwo.id]);

		assertRole(roles[0], seededRoleOne);
		assertRole(roles[1], seededRoleTwo);
	});

	it("should only retrieve existing roles", async () => {
		const seededRoleOne = await seedRole({});
		const seededRoleTwo = await seedRole({});
		const seededRoleIdThree = "non-existing-role-id";

		const roles = await roleRepository.getRolesByIds([
			seededRoleOne.id,
			seededRoleTwo.id,
			seededRoleIdThree,
		]);

		assertRole(roles[0], seededRoleOne);
		assertRole(roles[1], seededRoleTwo);
		expect(roles[2]).toBeUndefined();
	});

	it("should retrieve deleted roles when includeDeleted is true", async () => {
		const seededRoleOne = await seedRole({});
		const seededRoleTwo = await seedRole({});
		const seededRoleThree = await seedRole({ isDeleted: true, deletedAt: new Date() });

		const roles = await roleRepository.getRolesByIds(
			[seededRoleOne.id, seededRoleTwo.id, seededRoleThree.id],
			{ includeDeleted: true },
		);

		assertRole(roles[0], seededRoleOne);
		assertRole(roles[1], seededRoleTwo);
		assertRole(roles[2], seededRoleThree);
	});

	it("should return an empty array when given non-existing role id", async () => {
		const users = await roleRepository.getRolesByIds(["non-existing-role-id"]);

		expect(users).toEqual([]);
	});
});
