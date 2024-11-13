import { UserFactory } from "@/modules/user/src/domain/models/user/factory";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { Roles } from "@/shared/lib/types";

describe("UserFactory", () => {
  const userProps = {
    id: "user-id",
    name: "Luis Bulatao",
    email: "luis.bulatao@neu.edu.ph",
    emailVerified: null,
    image: "profile-image-link.jpg",
    role: "ADMIN",
    permissions: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  it("should successfully create a User when all properties are valid", () => {
    const result = UserFactory.create(userProps);
    
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(User);
    
    const user = result.getValue();
    expect(user.id).toBe(userProps.id);
    expect(user.name.value).toBe(userProps.name);
    expect(user.email).toBe(userProps.email);
    expect(user.image).toBe(userProps.image);
    expect(user.role.value).toBe(userProps.role);
    expect(user.permissions.value).toBe(userProps.permissions);
    expect(user.createdAt).toBe(userProps.createdAt);
    expect(user.updatedAt).toBe(userProps.updatedAt);
  });
  
  it("should fail if UserName creation fails", () => {
    const invalidNameProps = { ...userProps, name: "a".repeat(61) };
    const result = UserFactory.create(invalidNameProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Username is limited to 60 characters long");
  });
  
  it("should fail if UserRole creation fails", () => {
    const invalidRoleProps = { ...userProps, role: "ADMINS" };
    const result = UserFactory.create(invalidRoleProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(`ADMINS is not in ${Object.values(Roles)}`);
  });
  
  it("should fail if UserPermission creation fails", () => {
    const invalidPermissionProps = { ...userProps, permissions: -1 };
    const result = UserFactory.create(invalidPermissionProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Permission value must be greater than 0");
  });
  
  it("should fail if a properties are invalid", () => {
    const invalidProps = {
      ...userProps,
      name: "a".repeat(61),
      role: "ADMINS",
      permissions: -1,
    };
    const result = UserFactory.create(invalidProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Username is limited to 60 characters long");
  });
});
