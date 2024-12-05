import { Permissions } from "@/modules/user/src/shared/permissions";
import { GetUsersByPaginationUseCase } from "@/modules/user/src/useCases/user/getUsersByPaginationUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("GetUsersByPaginationUseCase", () => {
	let getUsersByPaginationUseCase: GetUsersByPaginationUseCase;

	beforeAll(() => {
		getUsersByPaginationUseCase = new GetUsersByPaginationUseCase();
	});

	beforeEach(async () => {
		// To prevent violating the foreign key constraint between UserAuditLog and User
		await db.userAuditLog.deleteMany();
		await db.user.deleteMany();
	});

	it("should return users, limited by pagination size", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});
		const seededUserThree = await seedUser({});

		const seededUserRequestedBy = await seedUser({});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};

		const result = await getUsersByPaginationUseCase.execute(request);

		expect(result.users).toHaveLength(2);
		expect(result.page).toBe(1);
		expect(result.hasNextPage).toBe(true);
		expect(result.hasPreviousPage).toBe(false);
		expect(result.totalPages).toBe(2);

		const userIds = result.users.map((user) => user.id);
    expect(userIds).toEqual([seededUserOne.id, seededUserTwo.id]);
    expect(userIds).not.toContain(seededUserThree.id);
	});

	it("should return users with delete users since includeDeleted is true, limited by pagination size", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({
			isDeleted: true,
			deletedAt: new Date()
		});
		const seededUserThree = await seedUser({});

		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_USER,
		});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id,
			includeDeleted: true,
		};

		const result = await getUsersByPaginationUseCase.execute(request);

		const userIds = result.users.map((user) => user.id);
    expect(userIds).toEqual([seededUserOne.id, seededUserTwo.id]);
    expect(userIds).not.toContain(seededUserThree.id);
	});

	it("should not return deleted users, limited by pagination size", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({
			isDeleted: true,
			deletedAt: new Date()
		});
		const seededUserThree = await seedUser({});

		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_USER,
		});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id
		};

		const result = await getUsersByPaginationUseCase.execute(request);

		const userIds = result.users.map((user) => user.id);
    expect(userIds).toEqual([seededUserOne.id, seededUserThree.id]);
    expect(userIds).not.toContain(seededUserTwo.id);
	});

	it("should return an empty list and pagination information when no users are seeded", async () => {
		const request = {
			perPage: 10,
			page: 1,
			requestedById: "non-existent-id",
		};

		const result = await getUsersByPaginationUseCase.execute(request);

		expect(result.users).toEqual([]);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPreviousPage).toBe(false);
		expect(result.page).toBe(1);
		expect(result.totalPages).toBe(0);
	});
});
