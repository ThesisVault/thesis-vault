import { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";
import { Roles } from "@/shared/lib/types";

describe("UserRole", () => {
  it("should create a UserRole instance with a valid role", () => {
    const result = UserRole.create(Roles.ADMIN);
    
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(UserRole);
    expect(result.getValue().value).toBe('ADMIN');
  });
  
  it("should fail if role is invalid", () => {
    const invalidRole = "INVALID_ROLE";
    const result = UserRole.create(invalidRole);
    
    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(`${invalidRole} is not in ${Object.values(Roles)}`);
  });
});
