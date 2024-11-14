import { UserFactory } from "@/modules/user/src/domain/models/user/factory";
import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { Roles } from "@/shared/lib/types";
import { faker } from "@faker-js/faker";

describe("UserFactory", () => {
  const mockUserData = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: null,
    image: faker.image.url(),
    role: faker.helpers.arrayElement(Object.values(Roles)),
    permissions: faker.number.int({ min: 0, max: 4095, multipleOf: 2 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
  
  it("should successfully create a User when all properties are valid", () => {
    const result = UserFactory.create(mockUserData);
    
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(User);
  });
  
  it("should fail if name is greater than the maximum value", () => {
    const invalidNameProps = { ...mockUserData, name: "a".repeat(61) };
    const result = UserFactory.create(invalidNameProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Username is limited to 60 characters long");
  });
  
  it("should fail when role is invalid", () => {
    const invalidRoleProps = { ...mockUserData, role: "ADMINS" };
    const result = UserFactory.create(invalidRoleProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(`ADMINS is not in ${Object.values(Roles)}`);
  });
  
  it("should fail when permission have negative value", () => {
    const invalidPermissionProps = { ...mockUserData, permissions: -1 };
    const result = UserFactory.create(invalidPermissionProps);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Permission value must be greater than or equal 0");
  });
});
