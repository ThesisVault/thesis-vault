import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { GetUsersWithPaginationUseCase } from "@/modules/user/src/useCases/getUsersWithPaginationUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("Test User Repository getUsersByPagination", () => {
	let userRepository: UserRepository;

	beforeAll(async () => {
		userRepository = new UserRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should return paginated users", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});

		const result = await userRepository.getUsersByPagination({ skip: 0, size: 2 });

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ _id: seededUserOne.id }),
				expect.objectContaining({ _id: seededUserTwo.id }),
			]),
		);
	});

	it("should return an empty list if no users are found", async () => {
		const users = await userRepository.getUsersByPagination({ skip: 0, size: 2 });
		expect(users).toEqual([]);
	});
});
