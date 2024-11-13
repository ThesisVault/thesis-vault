import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";
import { Roles } from "@/shared/lib/types";

describe("User", () => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const userProps = {
    id: "user-id",
    name: UserName.create("Luis Bulatao").getValue(),
    email: "luis.bulatao@neu.edu.ph",
    emailVerified: null,
    image: "profile-image-link.jpg",
    role: UserRole.create(Roles.ADMIN).getValue(),
    permissions: UserPermission.create(15).getValue(),
    createdAt: createdAt,
    updatedAt: updatedAt,
  };
  
  it("should create a User", () => {
    const user = User.create(userProps);
    
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe("user-id");
    expect(user.name.value).toBe("Luis Bulatao");
    expect(user.email).toBe("luis.bulatao@neu.edu.ph");
    expect(user.image).toBe("profile-image-link.jpg");
    expect(user.role.value).toBe("ADMIN");
    expect(user.permissions.value).toBe(15);
    expect(user.createdAt.toString()).toBe(createdAt.toString());
    expect(user.updatedAt.toString()).toBe(updatedAt.toString());
  });
  
  it("should get correct values from getters", () => {
    const user = User.create(userProps);
    
    expect(user.id).toBe("user-id");
    expect(user.name.value).toBe("Luis Bulatao");
    expect(user.role.value).toBe("ADMIN");
    expect(user.permissions.value).toBe(15);
  });
});
