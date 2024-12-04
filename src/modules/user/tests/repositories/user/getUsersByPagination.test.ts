import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import type { Pagination } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

describe("Test User Repository getUsersByPagination", () => {
	let userRepository: UserRepository;

	beforeAll(async () => {
		userRepository = new UserRepository();
	});

	beforeEach(async () => {
		await db.user.deleteMany();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should return paginated users", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});

		const pagination: Pagination = { skip: 0, size: 2 };
		const result = await userRepository.getUsersByPagination({
			pagination,
			options: {},
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ _id: seededUserOne.id }),
				expect.objectContaining({ _id: seededUserTwo.id }),
			]),
		);
	});

	it("should return an empty list if no users are found", async () => {
		const pagination: Pagination = { skip: 0, size: 2 };
		const users = await userRepository.getUsersByPagination({
			pagination,
			options: {},
		});
		expect(users).toEqual([]);
	});
});
