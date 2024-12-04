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

	it("should successfully retrieve the role by roleId", async () => {
		const seededRole = await seedRole({});
		const requestedByUser = await seedUser({});

		const request: GetRoleByIdDTO = {
			roleId: seededRole.id,
			name: seededRole.name,
			requestedById: requestedByUser.id,
		};

		const role = await getRoleByIdUseCase.execute(request);

		expect(role).toBeDefined();
		expect(role).toBe(request.name);
	});

	it("should null if role does not exists", async () => {
		const seededRole = await seedRole({});
		const requestedByUser = await seedUser({});

		const request: GetRoleByIdDTO = {
			roleId: "non-existing-id",
			name: seededRole.name,
			requestedById: requestedByUser.id,
		};

		const role = await getRoleByIdUseCase.execute(request);

		expect(role).toBeNull();
	});
});
