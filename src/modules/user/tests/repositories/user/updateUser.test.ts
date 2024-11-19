import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { createUserDomainObject } from "@/modules/user/tests/utils/user/createUserDomainObject";

describe("UserRepository.updateUser", () => {
  let userRepository: UserRepository;
  
  beforeAll(async () => {
    userRepository = new UserRepository();
  });
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  it("should update user properties", async () => {
    const seededUser = await seedUser({});
    const updatedUser = await userRepository.updateUser(
      UserMapper.toDomain({
        ...seededUser,
        name: "Luis Joshua"
      })
    );
    
    expect(updatedUser).toBeTruthy();
    expect(updatedUser!.id).toBe(seededUser.id);
    expect(updatedUser!.nameValue).toBe("Luis Joshua");
    expect(updatedUser!.email).toBe(seededUser.email);
    expect(updatedUser!.image).toBe(seededUser.image);
  });
  
  it("should return null when try to update non-existing user", async () => {
    const userDomainObject = createUserDomainObject({});
    const user = await userRepository.updateUser(userDomainObject);

    expect(user).toBeNull();
  })
});
