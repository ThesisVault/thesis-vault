import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { NotFoundError } from "@/shared/core/errors";
import type { GetRoleByIdDTO } from "../../src/dtos/userDTO";
import { GetRoleByIdUseCase } from "../../src/useCases/getRoleByIdUseCase";
import { seedUser } from "../utils/user/seedUser";

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
			requestedById: requestedByUser.id,
		};

		const roleId = await getRoleByIdUseCase.execute(request);

		expect(roleId).toBe(seededRole.id);
	});

	it("should throw an error if roleId does not exists", async () => {
		const requestedByUser = await seedUser({});

		const request: GetRoleByIdDTO = {
			roleId: "non-existent-role-id",
			requestedById: requestedByUser.id,
		};

		let errorMessage = "";
		try {
			await getRoleByIdUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}

		expect(errorMessage).toBe(`Role ${request.roleId} not found`);
	});

	it("should throw an error if roleId is null", async () => {
		const requestedByUser = await seedUser({});

		const request: GetRoleByIdDTO = {
			roleId: null,
			requestedById: requestedByUser.id,
		};

		let errorMessage = "";
		try {
			await getRoleByIdUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}

		const roleId = await getRoleByIdUseCase.execute(request);

		expect(roleId).toBeNull();
	});
});
