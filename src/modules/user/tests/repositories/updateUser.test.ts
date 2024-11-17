import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "@/modules/user/tests/utils/seedUser";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { createUserDomainObject } from "@/modules/user/tests/utils/createUserDomainObject";

describe("UserRepository.updateUser", () => {
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
    expect(updatedUser!.roleValue).toBe(seededUser.role);
    expect(updatedUser!.permissionsValue).toBe(seededUser.permissions);
  });
  
  it("should return null when try to update non-existing user", async () => {
    const userDomainObject = createUserDomainObject({});
    const user = await userRepository.updateUser(userDomainObject);

    expect(user).toBeNull();
  })
});
