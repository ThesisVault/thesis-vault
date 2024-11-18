import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { db } from "@/shared/infrastructure/database";

describe("Test Role Repository getRoleById", () => {
	let roleRepository: IRoleRepository;

	beforeAll(async () => {
		roleRepository = new RoleRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve existing user found by Id", async () => {
		const seededRole = await seedRole({});
		const role = await roleRepository.getRoleById(seededRole.id);

		expect(role!.id).toBe(seededRole.id);
		expect(role!.nameValue).toBe(seededRole.name);
		expect(role!.permissionsValue).toBe(seededRole.permissions);
	});

	it("should retrieve deleted user when includeDeleted is true", async () => {
		const seededRole = await seedRole({ isDeleted: true, deletedAt: new Date() });

		const role = await roleRepository.getRoleById(seededRole.id, { includeDeleted: true });

		expect(role!.id).toBe(seededRole.id);
		expect(role!.nameValue).toBe(seededRole.name);
		expect(role!.permissionsValue).toBe(seededRole.permissions);
	});

	it("should return null when given non-existing user id", async () => {
		const role = await roleRepository.getRoleById("not-a-user-id");

		expect(role).toBeNull();
	});
});
