import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";

describe("UserPermission", () => {
  it("should create a UserPermission instance with valid permission bits", () => {
    const result = UserPermission.create(15);
    
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(UserPermission);
    expect(result.getValue().value).toBe(15);
  });
  
  it("should fail if permissionBits is negative", () => {
    const result = UserPermission.create(-1);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Permission value must be greater than or equal 0");
  });
});
