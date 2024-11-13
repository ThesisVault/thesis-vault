import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";
import { Roles } from "@/shared/lib/types";

describe("UserMapper", () => {
  const userProps = {
    id: "user-id",
    name: UserName.create("Luis Bulatao").getValue(),
    email: "luis.bulatao@neu.edu.ph",
    emailVerified: null,
    image: "profile-image-link.jpg",
    role: UserRole.create(Roles.ADMIN).getValue(),
    permissions: UserPermission.create(15).getValue(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  it("should map to domain from persistence data", () => {
    const rawData = {
      ...userProps,
      name: userProps.name.value,
      permissions: userProps.permissions.value,
      role: userProps.role.value
    };
    const user = UserMapper.toDomain(rawData);
    
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(rawData.id);
    expect(user.name.value).toBe(rawData.name);
    expect(user.permissions.value).toBe(rawData.permissions);
    expect(user.role.value).toBe(rawData.role);
  });
  
  it("should map to persistence from domain", () => {
    const user = User.create(userProps);
    const persistence = UserMapper.toPersistence(user);
    
    expect(persistence.id).toBe(user.id);
    expect(persistence.name).toBe(user.name.value);
    expect(persistence.permissions).toBe(user.permissions.value);
    expect(persistence.role).toBe(user.role.value);
  });
});
