import type { GetUsersByPaginationDTO } from "@/modules/user/src/dtos/userDTO";
import { GetUsersByPaginationController } from "@/modules/user/src/infrastructure/http/controllers/user/getUsersByPaginationController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("GetUsersByPaginationController", () => {
	let getUsersByPaginationController: GetUsersByPaginationController;

	beforeAll(() => {
		getUsersByPaginationController = new GetUsersByPaginationController();
	});

	beforeEach(async () => {
		await db.user.deleteMany();
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
		const response = await getUsersByPaginationController.executeImpl(request);

		expect(response.users.length).toBe(6);
		expect(response.page).toBe(1);

		const userIds = response.users.map((user) => user.id);
		expect(userIds).toEqual(
			expect.arrayContaining([
				seededUserOne.id,
				seededUserTwo.id,
				seededUserThree.id,
				seededUserFour.id,
				seededUserFive.id,
			]),
		);

		expect(response.hasPreviousPage).toBe(false);
		expect(response.hasNextPage).toBe(false);
		expect(response.totalPages).toBe(1);
	});

	it("should return users, limited by pagination size", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});
		const seededUserThree = await seedUser({});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_USER,
		});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};

		const response = await getUsersByPaginationController.executeImpl(request);

		expect(response.users.length).toBe(2);

		const userIds = response.users.map((user) => user.id).sort();
		expect(userIds).toEqual(expect.arrayContaining([seededUserOne.id, seededUserTwo.id].sort()));

		expect(userIds).not.toContain(seededUserThree.id);
	});

	it("should return deleted users when includeDeleted is true, limited by pagination size", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});
		const seededUserThree = await seedUser({});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_USER,
		});

		await db.user.update({
			where: { id: seededUserThree.id },
			data: { deletedAt: new Date() },
		});

		const request = {
			perPage: 3,
			page: 1,
			requestedById: seededUserRequestedBy.id,
			includeDeleted: true,
		};

		const response = await getUsersByPaginationController.executeImpl(request);

		expect(response.users.length).toBe(3);

		const userIds = response.users.map((user) => user.id);
		expect(userIds).toEqual(
			expect.arrayContaining([seededUserOne.id, seededUserTwo.id, seededUserThree.id]),
		);
	});

	it("should throw a ForbiddenError when the user who requested does not have the required permission", async () => {
		const seededUserRequestedBy = await seedUser({
			allowPermissions: 0,
			denyPermissions: Permissions.MANAGE_USER,
		});

		const request: GetUsersByPaginationDTO = {
			page: 1,
			perPage: 10,
			requestedById: seededUserRequestedBy.id,
		};

		let errorMessage = "";
		try {
			await getUsersByPaginationController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_USER permission`,
		);
	});
});
