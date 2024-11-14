import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { seedUser } from "@/modules/user/test/utils/seedUser";

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;
  let mockUser: User;
  
  beforeAll(async () => {
    userRepository = new UserRepository();
  });
  
  beforeEach(async () => {
    mockUser = await seedUser({});
  });
  
  afterEach(async () => {
    await db.user.deleteMany();
  })
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  it("should retrieve existing user found by Id", async () => {
    const user = await userRepository.getUserById(mockUser.id);
    
    expect(user).toBeTruthy();
    expect(user).toBeInstanceOf(User);
    expect(user!.id).toBe(mockUser.id);
    expect(user!.nameValue).toBe(mockUser.nameValue);
    expect(user!.email).toBe(mockUser.email);
    expect(user!.image).toBe(mockUser.image);
    expect(user!.roleValue).toBe(mockUser.roleValue);
    expect(user!.permissionsValue).toBe(mockUser.permissionsValue);
  });
  
  it("should return null when given non-existing user id", async () => {
    const user = await userRepository.getUserById("not-a-user-id");
    
    expect(user).toBeNull();
  })
});
