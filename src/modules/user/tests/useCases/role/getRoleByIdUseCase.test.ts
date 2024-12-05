import type { GetRoleByIdDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { GetRoleByIdUseCase } from "@/modules/user/src/useCases/role/getRoleByIdUseCase";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "../../utils/user/seedUser";

describe("GetRoleByIdUseCase", () => {
	let getRoleByIdUseCase: GetRoleByIdUseCase;
	let roleRepository: IRoleRepository;

	beforeAll(() => {
		roleRepository = new RoleRepository();
		getRoleByIdUseCase = new GetRoleByIdUseCase();
	});

	it("should return role when roleId exist", async () => {
		const seededRole = await seedRole({});
		const requestedByUser = await seedUser({});

		const request: GetRoleByIdDTO = {
			roleId: seededRole.id,
			requestedById: requestedByUser.id,
		};

		const role = await getRoleByIdUseCase.execute(request);

		expect(role!.id).toBe(request.roleId);
    expect(role!.nameValue).toBe(seededRole.name);
    expect(role!.color).toBe(seededRole.color);
    expect(role!.permissionsValue).toBe(seededRole.permissions);
	});

	it("should null when roleId does not exist", async () => {
		const requestedByUser = await seedUser({});

		const request: GetRoleByIdDTO = {
			roleId: "non-existing-id",
			requestedById: requestedByUser.id,
		};

		const role = await getRoleByIdUseCase.execute(request);

		expect(role).toBeNull();
	});
});
