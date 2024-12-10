import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { GetRolesUseCase } from "@/modules/user/src/useCases/role/getRolesUseCase";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { db } from "@/shared/infrastructure/database";

describe("GetRolesUseCase", () => {
	let getRolesUseCase: GetRolesUseCase;
	let roleRepository: IRoleRepository;

	beforeAll(() => {
		roleRepository = new RoleRepository();
		getRolesUseCase = new GetRolesUseCase();
	});

	beforeEach(async () => {
		await db.role.deleteMany();
	});

	it("should return roles", async () => {
		const seededRoleOne = await seedRole({});
		const seededRoleTwo = await seedRole({});
		const seededRoleThree = await seedRole({});

		const roles = await getRolesUseCase.execute();

		expect(roles[0].id).toBe(seededRoleOne.id);
		expect(roles[1].id).toBe(seededRoleTwo.id);
		expect(roles[2].id).toBe(seededRoleThree.id);
	});

	it("should return empty array when no role has found", async () => {
		const roles = await getRolesUseCase.execute();

		expect(roles).toEqual([]);
	});
});
