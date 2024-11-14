import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import type { User } from "@/modules/user/src/domain/models/user/classes/user";
import { seedUser } from "@/modules/user/test/utils/seedUser";

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;
  let mockUser: User;
  let mockUserTwo: User;
  
  const assertUser = (userValue: User, expectedUserValue: User) => {
    expect(userValue!.id).toBe(expectedUserValue.id);
    expect(userValue!.nameValue).toBe(expectedUserValue.nameValue);
    expect(userValue!.email).toBe(expectedUserValue.email);
    expect(userValue!.image).toBe(expectedUserValue.image);
    expect(userValue!.roleValue).toBe(expectedUserValue.roleValue);
    expect(userValue!.permissionsValue).toBe(expectedUserValue.permissionsValue);
  }
  
  beforeAll(async () => {
    userRepository = new UserRepository();
  });
  
  beforeEach(async () => {
    mockUser = await seedUser({});
    mockUserTwo = await seedUser({});
  });
  
  afterEach(async () => {
    await db.user.deleteMany();
  })
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  it("should retrieve a users by Id", async () => {
    const users = await userRepository.getUsersByIds([mockUser.id, mockUserTwo.id]);
    
    expect(users.length).toBe(2);
    assertUser(users[0], mockUser);
    assertUser(users[1], mockUserTwo);
  });
  
  it("should retrieve only 1 user found by id", async () => {
    const users = await userRepository.getUsersByIds([mockUser.id, "non-existing-user-id"]);
    
    expect(users.length).toBe(1);
    assertUser(users[0], mockUser);
  })
  
  it("should return null when given non-existing user id", async () => {
    const users = await userRepository.getUsersByIds(["non-existing-user-id"]);
    
    expect(users.length).toBe(0);
  })
});
