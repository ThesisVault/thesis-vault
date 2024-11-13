import { UserFactory } from "@/modules/user/src/domain/models/user/factory";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { Roles } from "@/shared/lib/types";

describe("UserFactory", () => {
  const createdAt = new Date();
  const updatedAt = new Date();
  const userProps = {
    id: "user-id",
    name: "Luis Bulatao",
    email: "luis.bulatao@neu.edu.ph",
    emailVerified: null,
    image: "profile-image-link.jpg",
    role: "ADMIN",
    permissions: 8,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };
  
  it("should successfully create a User when all properties are valid", () => {
    const result = UserFactory.create(userProps);
    
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(User);
  });
  
  it("should fail if name is greater than the maximum value", () => {
    const invalidNameProps = { ...userProps, name: "a".repeat(61) };
    const result = UserFactory.create(invalidNameProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Username is limited to 60 characters long");
  });
  
  it("should fail when role is invalid", () => {
    const invalidRoleProps = { ...userProps, role: "ADMINS" };
    const result = UserFactory.create(invalidRoleProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(`ADMINS is not in ${Object.values(Roles)}`);
  });
  
  it("should fail when permission have negative value", () => {
    const invalidPermissionProps = { ...userProps, permissions: -1 };
    const result = UserFactory.create(invalidPermissionProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Permission value must be greater than 0");
  });
});
