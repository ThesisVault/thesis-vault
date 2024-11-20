import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/updateUserRoleIdDTO";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { UpdateUserRoleIdUseCase } from "@/modules/user/src/useCases/updateUserRoleIdUseCase";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { NotFoundError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";

describe("UpdateUserRoleIdUseCase", () => {
	let updateUserRoleIdUseCase: UpdateUserRoleIdUseCase;
	let userRepository: IUserRepository;
	let roleRepository: IRoleRepository;

	beforeAll(() => {
		updateUserRoleIdUseCase = new UpdateUserRoleIdUseCase();
		userRepository = new UserRepository();
		roleRepository = new RoleRepository();
	});

	it("should throw NotFoundError if user does not exist", async () => {
		const request: UpdateUserRoleIdDTO = {
			userId: "non-existent-user-id",
			roleId: faker.string.uuid(),
			requestedById: faker.string.uuid(),
		};

		let errorMessage = "";
		try {
			await updateUserRoleIdUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}

		expect(errorMessage).toBe(`User ${request.userId} not found`);
	});

	it("should throw NotFoundError if role does not exist", async () => {
		const seededUser = await seedUser({});
		const request: UpdateUserRoleIdDTO = {
			userId: seededUser.id,
			roleId: "non-existent-role-id",
			requestedById: seededUser.id,
		};

		let errorMessage = "";
		try {
			await updateUserRoleIdUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}

		expect(errorMessage).toBe(`Role ${request.roleId} not found`);
	});

	it("should successfully update the user role and return the updated user ID", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});

		const request: UpdateUserRoleIdDTO = {
			userId: seededUser.id,
			roleId: seededRole.id,
			requestedById: seededUser.id,
		};

		const updatedUserId = await updateUserRoleIdUseCase.execute(request);

		expect(updatedUserId).toBe(request.userId);

		const updatedUser = await userRepository.getUserById(request.userId);

		expect(updatedUser).toBeDefined();
		expect(updatedUser!.id).toBe(request.userId);
		expect(updatedUser!.roleId).toBe(seededRole.id);
	});
});