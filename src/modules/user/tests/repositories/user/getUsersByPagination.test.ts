import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("Test User Repository getUsersByPagination", () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    // To prevent violating the foreign key constraint between UserAuditLog and User
    await db.userAuditLog.deleteMany();
    await db.user.deleteMany();
  });

  it("should return users without delete users since includeDeleted is false, limited by pagination size", async () => {
    const seededUserOne = await seedUser({});
    const seededUserTwo = await seedUser({});
    const seededUserThree = await seedUser({});

    const result = await userRepository.getUsersByPagination({
      skip: 0,
      size: 2,
    });

    const userIds = result.map((user) => user.id);

    expect(userIds).toEqual([seededUserOne.id, seededUserTwo.id]);
    expect(userIds).not.toContain(seededUserThree.id);
  });

  it("should return users with delete users since includeDeleted is true, limited by pagination size", async () => {
    const seededUserOne = await seedUser({});
    const seededUserTwo = await seedUser({
      isDeleted: true,
      deletedAt: new Date(),
    });
    const seededUserThree = await seedUser({});

    const result = await userRepository.getUsersByPagination(
      { skip: 0, size: 2 },
      { includeDeleted: true }
    );

    const userIds = result.map((user) => user.id);

    expect(userIds).toEqual([seededUserOne.id, seededUserTwo.id]);
    expect(userIds).not.toContain(seededUserThree.id);
  });

  it("should return an empty list if no users are found", async () => {
    const users = await userRepository.getUsersByPagination({
      skip: 0,
      size: 2,
    });
    expect(users).toEqual([]);
  });
});
