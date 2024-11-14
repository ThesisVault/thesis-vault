import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";
import { Roles } from "@/shared/lib/types";
import { faker } from "@faker-js/faker";

describe("User", () => {
  const mockUserData = {
    id: faker.string.uuid(),
    name: UserName.create(faker.person.fullName()).getValue(),
    email: faker.internet.email(),
    emailVerified: null,
    image: faker.image.url(),
    role: UserRole.create(faker.helpers.arrayElement(Object.values(Roles))).getValue(),
    permissions: UserPermission.create(faker.number.int({ min: 0, max: 4095, multipleOf: 2 })).getValue(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
  
  it("should create a User", () => {
    const user = User.create(mockUserData);
    
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(mockUserData.id);
    expect(user.name.value).toBe(mockUserData.name.value);
    expect(user.email).toBe(mockUserData.email);
    expect(user.image).toBe(mockUserData.image);
    expect(user.role.value).toBe(mockUserData.role.value);
    expect(user.permissions.value).toBe(mockUserData.permissions.value);
    expect(user.createdAt.toString()).toBe(mockUserData.createdAt.toString());
    expect(user.updatedAt.toString()).toBe(mockUserData.updatedAt.toString());
  });
});
