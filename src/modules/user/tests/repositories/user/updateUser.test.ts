import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { createUserDomainObject } from "@/modules/user/tests/utils/user/createUserDomainObject";
import { faker } from "@faker-js/faker";

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
    const newUserData = {
      name: faker.person.fullName(),
      allowPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
      denyPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 })
    }
    const domainUser = UserMapper.toDomain({
      ...seededUser,
      ...newUserData
    })
    const updatedUser = await userRepository.updateUser(domainUser);
    
    expect(updatedUser).toBeTruthy();
    expect(updatedUser!.id).toBe(seededUser.id);
    expect(updatedUser!.nameValue).toBe(newUserData.name);
    expect(updatedUser!.allowPermissionsValue).toBe(newUserData.allowPermissions);
    expect(updatedUser!.denyPermissionsValue).toBe(newUserData.denyPermissions);
  });
  
  it("should return null when trying to update non-existing user", async () => {
    const userDomainObject = createUserDomainObject({});
    const user = await userRepository.updateUser(userDomainObject);

    expect(user).toBeNull();
  })
});
