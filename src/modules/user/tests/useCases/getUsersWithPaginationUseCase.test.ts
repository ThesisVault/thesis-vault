import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { GetUsersWithPaginationUseCase } from "@/modules/user/src/useCases/getUsersWithPaginationUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("GetUsersWithPaginationUseCase", () => {
	let getUsersWithPaginationUseCase: GetUsersWithPaginationUseCase;
	let userRepository: UserRepository;

	beforeAll(() => {
		userRepository = new UserRepository();
		getUsersWithPaginationUseCase = new GetUsersWithPaginationUseCase(userRepository);
	});

	beforeEach(async () => {
		await db.user.deleteMany();
	});

	it("should return paginated users and pagination information", async () => {
		await Promise.all(Array.from({ length: 5 }).map(() => seedUser({})));

		const request = { perPage: 10, page: 1 };
		const result = await getUsersWithPaginationUseCase.execute(request);

		expect(result.users.length).toBe(5);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPreviousPage).toBe(false);
		expect(result.page).toBe(1);
		expect(result.totalPages).toBe(1);
	});

	it("should return an empty list and pagination information when no users are seeded", async () => {
		const request = { perPage: 10, page: 1 };

		const result = await getUsersWithPaginationUseCase.execute(request);

		expect(result.users).toEqual([]);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPreviousPage).toBe(false);
		expect(result.page).toBe(1);
		expect(result.totalPages).toBe(0);
	});
});
