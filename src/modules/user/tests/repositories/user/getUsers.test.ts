import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("Test User Repository getUsers", () => {
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

	it("should return paginated users and total pages", async () => {
		const seededUsers = await Promise.all(Array.from({ length: 2 }).map(() => seedUser({})));

		const result = await userRepository.getUsers({ skip: 0, take: 2 });

		expect(result.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ _id: seededUsers[0].id }),
				expect.objectContaining({ _id: seededUsers[1].id }),
			]),
		);

		expect(result.totalPages).toBe(1);
	});

	it("should return an empty list and total pages as 0 if no users are found", async () => {
		const result = await userRepository.getUsers({ skip: 0, take: 2 });

		expect(result.users).toEqual([]);
		expect(result.totalPages).toBe(0);
	});

	it("should return paginated users for non-first pages", async () => {
		const seededUsers = await Promise.all(Array.from({ length: 5 }).map(() => seedUser({})));

		const result = await userRepository.getUsers({ skip: 2, take: 2 });

		expect(result.users.length).toBe(2);
		expect(result.totalPages).toBe(3);

		expect(result.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ _id: seededUsers[2].id }),
				expect.objectContaining({ _id: seededUsers[3].id }),
			]),
		);
	});

	it("should handle a case where 'take' exceeds the total users", async () => {
		const seededUsers = await Promise.all(Array.from({ length: 3 }).map(() => seedUser({})));

		const result = await userRepository.getUsers({ skip: 0, take: 10 });

		expect(result.users.length).toBe(3);
		expect(result.totalPages).toBe(1);

		expect(result.users).toEqual(
			expect.arrayContaining(seededUsers.map((user) => expect.objectContaining({ id: user.id }))),
		);
	});
});
