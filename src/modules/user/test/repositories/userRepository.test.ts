import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import { Roles } from "@/shared/lib/types";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import type { User as UserPersistence } from "@prisma/client"
import { faker } from '@faker-js/faker';

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;
  let mockUserData: UserPersistence;
  
  beforeAll(async () => {
    userRepository = new UserRepository();
  });
  
  beforeEach(async () => {
    mockUserData = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: null,
      image: faker.image.url(),
      role: faker.helpers.arrayElement(Object.values(Roles)),
      permissions: faker.number.int({ min: 0, max: 4095, multipleOf: 2 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    }
    
    await db.user.create({
      data: mockUserData
    })
  });
  
  afterEach(async () => {
    await db.user.deleteMany();
  })
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  it("should retrieve a user by Id", async () => {
    const user = await userRepository.getUserById(mockUserData.id);
    
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(mockUserData.id);
    expect(user.name.value).toBe(mockUserData.name);
    expect(user.email).toBe(mockUserData.email);
    expect(user.image).toBe(mockUserData.image);
    expect(user.role.value).toBe(mockUserData.role);
    expect(user.permissions.value).toBe(mockUserData.permissions);
  });
  
  it("should return permission bits of a user", async () => {
    const permissions = await userRepository.getUserPermissionBits(mockUserData.id);
    expect(permissions).toBe(mockUserData.permissions);
  });
  
  it("should update a user data", async () => {
    const updatedUser = UserMapper.toDomain({
      ...mockUserData,
      email: "new.email@neu.edu.ph",
    })
    
    const user = await userRepository.updateUser(updatedUser);
    expect(user.email).toBe("new.email@neu.edu.ph");
    
    const shouldBeUpdatedUser = await userRepository.getUserById(mockUserData.id);
    expect(shouldBeUpdatedUser.email).toBe("new.email@neu.edu.ph");
  });
});
