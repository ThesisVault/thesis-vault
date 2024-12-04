import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { GetUsersWithPaginationUseCase } from "@/modules/user/src/useCases/getUsersWithPaginationUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("GetUsersWithPaginationUseCase", () => {
	let getUsersWithPaginationUseCase: GetUsersWithPaginationUseCase;
	let userRepository: UserRepository;

	beforeAll(() => {
		userRepository = new UserRepository();
		getUsersWithPaginationUseCase = new GetUsersWithPaginationUseCase(userRepository);
	});

	it("should return paginated users and pagination information", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});
		const seededUserThree = await seedUser({});
		const seededUserFour = await seedUser({});
		const seededUserFive = await seedUser({});
		const seededUserRequestedBy = await seedUser({});

		const request = {
			perPage: 10,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};

		const result = await getUsersWithPaginationUseCase.execute(request);

		expect(result.users.length).toBe(6);

		const userIds = result.users.map((user) => user.id);

		expect(userIds).toContain(seededUserOne.id);
		expect(userIds).toContain(seededUserTwo.id);
		expect(userIds).toContain(seededUserThree.id);
		expect(userIds).toContain(seededUserFour.id);
		expect(userIds).toContain(seededUserFive.id);

		expect(result.page).toBe(1);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPreviousPage).toBe(false);
		expect(result.totalPages).toBe(1);
	});

	it("should return an empty list and pagination information when no users are seeded", async () => {
		const request = {
			perPage: 10,
			page: 1,
			requestedById: "non-existent-id",
		};

		const result = await getUsersWithPaginationUseCase.execute(request);

		expect(result.users).toEqual([]);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPreviousPage).toBe(false);
		expect(result.page).toBe(1);
		expect(result.totalPages).toBe(0);
	});
});
