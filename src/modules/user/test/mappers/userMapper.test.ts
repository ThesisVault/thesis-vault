import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import type { User as UserPersistence } from "@prisma/client"
import { PermissionsBits, Roles } from "@/modules/user/src/domain/models/user/permission/constant";
import { faker } from "@faker-js/faker";

describe("UserMapper", () => {
  let mockUserData: UserPersistence;
  
  beforeEach(() => {
    mockUserData = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: null,
      image: faker.image.url(),
      role: faker.helpers.arrayElement(Object.values(Roles)),
      permissions: faker.number.int({ min: 0, max: PermissionsBits.ALL, multipleOf: 2 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  })
  
  it("should map to domain from persistence data", () => {
    const user = UserMapper.toDomain(mockUserData);
    
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(mockUserData.id);
    expect(user.nameValue).toBe(mockUserData.name);
    expect(user.permissionsValue).toBe(mockUserData.permissions);
    expect(user.roleValue).toBe(mockUserData.role);
  });
  
  it("should map to persistence from domain", () => {
    const user = UserMapper.toDomain(mockUserData);
    const persistence = UserMapper.toPersistence(user);
    
    expect(persistence.id).toBe(user.id);
    expect(persistence.name).toBe(user.nameValue);
    expect(persistence.permissions).toBe(user.permissionsValue);
    expect(persistence.role).toBe(user.roleValue);
  });
});