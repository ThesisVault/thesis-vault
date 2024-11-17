import { db } from "@/shared/infrastructure/database";
import { seedUser } from "@/modules/user/tests/utils/seedUser";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { createUserDomainObject } from "@/modules/user/tests/utils/createUserDomainObject";

describe("UserRepository.updateUsers", () => {
  let userRepository: UserRepository;
  
  beforeAll(async () => {
    userRepository = new UserRepository();
  });
  
  afterEach(async () => {
    await db.user.deleteMany();
  })
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  it("should update multiple user with different properties", async () => {
    const seededUser = await seedUser({});
    const seededUserTwo = await seedUser({});
    
    const updatedUsers = await userRepository.updateUsers(
      [
        UserMapper.toDomain({
          ...seededUser,
          name: "Luis Joshua"
        }),
        UserMapper.toDomain({
          ...seededUserTwo,
          name: "John Doe"
        })
      ]
    );
    
    expect(updatedUsers.length).toBe(2);
    expect(updatedUsers[0].id).toBe(seededUser.id);
    expect(updatedUsers[0].nameValue).toBe("Luis Joshua");
    expect(updatedUsers[1].id).toBe(seededUserTwo.id);
    expect(updatedUsers[1].nameValue).toBe("John Doe");
  });
  
  it("should return empty array when updating multiple user and 1 failed", async () => {
    const seededUser = await seedUser({});
    const nonExistingUser = createUserDomainObject({});
    
    const user = await userRepository.updateUsers([
      UserMapper.toDomain({
        ...seededUser,
        name: "Luis Joshua"
      }),
      nonExistingUser
    ]);

    expect(user.length).toBe(0);
  })
});
