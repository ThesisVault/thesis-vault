import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { DeleteUserUseCase } from "@/modules/user/src/useCases/deleteUserUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { NotFoundError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";

describe("DeleteUserUseCase", () => {
	let deleteUserUseCase: DeleteUserUseCase;
	let userRepository: IUserRepository;

	beforeEach(() => {
		deleteUserUseCase = new DeleteUserUseCase();
		userRepository = new UserRepository();
	});

	it("should successfully soft delete a user", async () => {
		const seededUser = await seedUser({});
		const request = { userId: seededUser.id };
		const result = await deleteUserUseCase.execute(request);

		expect(result).toBe(request.userId);

		const deletedUser = await userRepository.getUserById(seededUser.id, { includeDeleted: true });

		expect(deletedUser?.id).toBe(seededUser.id);
		expect(deletedUser?.isDeleted).toBe(true);
		expect(deletedUser?.deletedAt).toBeInstanceOf(Date);
	});

	it("should throw NotFoundError when the user does not exist", async () => {
		const request = { userId: faker.string.uuid() };

		let errorMessage = "";
		try {
			await deleteUserUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}

		expect(errorMessage).toBe(`User ${request.userId} not found`);
	});
});
