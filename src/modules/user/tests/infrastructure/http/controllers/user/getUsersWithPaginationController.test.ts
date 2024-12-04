import type { GetUsersWithPaginationDTO } from "@/modules/user/src/dtos/userDTO";
import { GetUsersWithPaginationController } from "@/modules/user/src/infrastructure/http/controllers/user/getUsersWithPaginationController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { GetUsersWithPaginationUseCase } from "@/modules/user/src/useCases/getUsersWithPaginationUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("GetUsersWithPaginationController", () => {
	let getUsersWithPaginationController: GetUsersWithPaginationController;
	let getUsersWithPaginationUseCase: GetUsersWithPaginationUseCase;

	beforeAll(() => {
		getUsersWithPaginationUseCase = new GetUsersWithPaginationUseCase();
		getUsersWithPaginationController = new GetUsersWithPaginationController(
			getUsersWithPaginationUseCase,
		);
	});

	it("should return paginated users and pagination information", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});
		const seededUserThree = await seedUser({});
		const seededUserFour = await seedUser({});
		const seededUserFive = await seedUser({});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_USER,
		});

		const request = {
			perPage: 10,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};
		const response = await getUsersWithPaginationController.executeImpl(request);

		expect(response.users.length).toBe(6);

		const userIds = response.users.map((user) => user.id);

		expect(userIds).toContain(seededUserOne.id);
		expect(userIds).toContain(seededUserTwo.id);
		expect(userIds).toContain(seededUserThree.id);
		expect(userIds).toContain(seededUserFour.id);
		expect(userIds).toContain(seededUserFive.id);

		expect(response.page).toBe(1);
		expect(response.hasPreviousPage).toBe(false);
		expect(response.hasNextPage).toBe(false);
		expect(response.totalPages).toBe(1);
	});

	it("should throw a ForbiddenError when the user who requested does not have the required permission", async () => {
		const seededUserRequestedBy = await seedUser({
			allowPermissions: 0,
			denyPermissions: Permissions.MANAGE_USER,
		});

		const request: GetUsersWithPaginationDTO = {
			page: 1,
			perPage: 10,
			requestedById: seededUserRequestedBy.id,
		};

		let errorMessage = "";
		try {
			await getUsersWithPaginationController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_USER permission`,
		);
	});
});
