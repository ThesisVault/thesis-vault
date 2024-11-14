import { UserRepository } from "@/modules/user/src/repositories/userRepository";
import { db } from "@/shared/infrastructure/database";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { seedUser } from "@/modules/user/test/utils/seedUser";

describe("Test User Repository getUserById", () => {
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
  
  it("should retrieve existing user found by Id", async () => {
    const seededUser = await seedUser({});
    const user = await userRepository.getUserById(seededUser.id);
    
    expect(user).toBeTruthy();
    expect(user).toBeInstanceOf(User);
    expect(user!.id).toBe(seededUser.id);
    expect(user!.nameValue).toBe(seededUser.name);
    expect(user!.email).toBe(seededUser.email);
    expect(user!.image).toBe(seededUser.image);
    expect(user!.roleValue).toBe(seededUser.role);
    expect(user!.permissionsValue).toBe(seededUser.permissions);
  });
  
  it("should return null when given non-existing user id", async () => {
    const user = await userRepository.getUserById("not-a-user-id");
    
    expect(user).toBeNull();
  })
});
