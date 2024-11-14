import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import type { User } from "@/modules/user/src/domain/models/user/classes/user";
import { seedUser } from "@/modules/user/test/utils/seedUser";
import type { User as UserPersistence } from "@prisma/client"

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;
  
  const assertUser = (userValue: User, expectedUserValue: UserPersistence) => {
    expect(userValue!.id).toBe(expectedUserValue.id);
    expect(userValue!.nameValue).toBe(expectedUserValue.name);
    expect(userValue!.email).toBe(expectedUserValue.email);
    expect(userValue!.image).toBe(expectedUserValue.image);
    expect(userValue!.roleValue).toBe(expectedUserValue.role);
    expect(userValue!.permissionsValue).toBe(expectedUserValue.permissions);
  }
  
  beforeAll(async () => {
    userRepository = new UserRepository();
  });
  
  afterEach(async () => {
    await db.user.deleteMany();
  })
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  it("should retrieve a users by Id", async () => {
    const seededUser: UserPersistence = await seedUser({});
    const seededUserTwo: UserPersistence = await seedUser({});
    const users = await userRepository.getUsersByIds([seededUser.id, seededUserTwo.id]);
    
    expect(users.length).toBe(2);
    assertUser(users[0], seededUser);
    assertUser(users[1], seededUserTwo);
  });
  
  it("should retrieve only 1 user found by id", async () => {
    const mockUser: UserPersistence = await seedUser({});
    const users = await userRepository.getUsersByIds([mockUser.id, "non-existing-user-id"]);
    
    expect(users.length).toBe(1);
    assertUser(users[0], mockUser);
  })
  
  it("should return null when given non-existing user id", async () => {
    const users = await userRepository.getUsersByIds(["non-existing-user-id"]);
    
    expect(users.length).toBe(0);
  })
});
