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
    expect(result.getErrorMessage()).toBe(`Permission value must be greater than or equal ${UserPermission.MINIMUM_PERMISSION_BITS_VALUE}`);
  });
  
  it("should fail if permissionBits is greater than maximum value", () => {
    const result = UserPermission.create(UserPermission.MAXIMUM_PERMISSION_BITS_VALUE + 1);
    
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(`Permission value must be less than or equal ${UserPermission.MAXIMUM_PERMISSION_BITS_VALUE}`);
  })
});
