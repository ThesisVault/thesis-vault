import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";
import { Roles } from "@/shared/lib/types";

describe("User", () => {
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
  
  it("should create a User", () => {
    const user = User.create(userProps);
    
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(userProps.id);
    expect(user.name).toBe(userProps.name);
    expect(user.email).toBe(userProps.email);
    expect(user.image).toBe(userProps.image);
    expect(user.role).toBe(userProps.role);
    expect(user.permissions).toBe(userProps.permissions);
    expect(user.createdAt).toBe(userProps.createdAt);
    expect(user.updatedAt).toBe(userProps.updatedAt);
  });
  
  it("should get correct values from getters", () => {
    const user = User.create(userProps);
    
    expect(user.id).toBe(userProps.id);
    expect(user.name).toBe(userProps.name);
    expect(user.role).toBe(userProps.role);
    expect(user.permissions).toBe(userProps.permissions);
  });
});
