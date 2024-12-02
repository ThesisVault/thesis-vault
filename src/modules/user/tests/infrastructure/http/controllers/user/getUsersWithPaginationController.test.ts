import { GetUsersWithPaginationController } from "@/modules/user/src/infrastructure/http/controllers/user/getUsersWithPaginationController";
import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { GetUsersWithPaginationUseCase } from "@/modules/user/src/useCases/getUsersWithPaginationUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("GetUsersWithPaginationController", () => {
	let getUsersWithPaginationController: GetUsersWithPaginationController;
	let getUsersWithPaginationUseCase: GetUsersWithPaginationUseCase;

	beforeEach(() => {
		const userRepository = new UserRepository(db.user);
		getUsersWithPaginationUseCase = new GetUsersWithPaginationUseCase(userRepository);
		getUsersWithPaginationController = new GetUsersWithPaginationController(
			getUsersWithPaginationUseCase,
		);
	});

	it("should return paginated users and pagination information", async () => {
		await db.user.deleteMany();

		await Promise.all(Array.from({ length: 5 }).map(() => seedUser({})));

		const request = { perPage: 10, page: 1 };
		const response = await getUsersWithPaginationController.executeImpl(request);

		expect(response.users.length).toBe(5);
		expect(response.hasNextPage).toBe(false);
		expect(response.page).toBe(1);
		expect(response.totalPages).toBe(1);
	});
});
