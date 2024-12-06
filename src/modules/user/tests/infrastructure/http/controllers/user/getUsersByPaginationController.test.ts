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
    // To prevent violating the foreign key constraint between UserAuditLog and User
    await db.userAuditLog.deleteMany();
    await db.user.deleteMany();
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
    expect(response.page).toBe(1);
    expect(response.hasPreviousPage).toBe(false);
    expect(response.hasNextPage).toBe(true);
    expect(response.totalPages).toBe(2);

    const userIds = response.users.map((user) => user.id);
    expect(userIds).toEqual([seededUserOne.id, seededUserTwo.id]);
    expect(userIds).not.toContain(seededUserThree.id);
  });

  it("should return users with deleted users since includeDeleted is true, limited by pagination size", async () => {
    const seededUserOne = await seedUser({});
    const seededUserTwo = await seedUser({
      isDeleted: true,
      deletedAt: new Date(),
    });
    const seededUserThree = await seedUser({});

    const seededUserRequestedBy = await seedUser({
      allowPermissions: Permissions.MANAGE_USER,
    });

    const request = {
      perPage: 2,
      page: 1,
      includeDeleted: true,
      requestedById: seededUserRequestedBy.id,
    };

    const response = await getUsersByPaginationController.executeImpl(request);

    expect(response.users.length).toBe(2);
    expect(response.page).toBe(1);
    expect(response.hasPreviousPage).toBe(false);
    expect(response.hasNextPage).toBe(true);
    expect(response.totalPages).toBe(2);

    const userIds = response.users.map((user) => user.id);
    expect(userIds).toEqual([seededUserOne.id, seededUserTwo.id]);
    expect(userIds).not.toContain(seededUserThree.id);
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
      `User ${request.requestedById} does not have MANAGE_USER permission`
    );
  });
});
