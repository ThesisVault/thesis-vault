import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import { Roles } from "@/shared/lib/types";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { User } from "@/modules/user/src/domain/models/user/classes/user";

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;
  const mockUserData = {
    id: 'cdb8d90f-dce0-4044-9e73-02ff7a53fbd9',
    name: 'Luis Bulatao',
    email: 'luis.bulatao@neu.edu.ph',
    emailVerified: null,
    image: 'profile-image-link.jpg',
    permissions: 0,
    role: Roles.GUEST,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  beforeAll(async () => {
    userRepository = new UserRepository();
  });
  
  beforeEach(async () => {
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
    const result = await userRepository.getUserById(mockUserData.id);
    
    expect(result).toMatchObject({
      id: "cdb8d90f-dce0-4044-9e73-02ff7a53fbd9",
    });
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
    expect(permissions).toBe(0);
  });
  
  it("should update a user data", async () => {
    const updatedUser = UserMapper.toDomain({
      ...mockUserData,
      email: "new.email@neu.edu.ph",
    })
    
    const user = await userRepository.updateUser(updatedUser);
    expect(user.email).toBe("new.email@neu.edu.ph");
  });
});
