import { Result } from "@/shared/core/result";

export class UserPermission {
  private readonly _value: number
  private static readonly MINIMUM_PERMISSION_BITS_VALUE = 0;
  
  private constructor(value: number) {
    this._value = value;
  }
  
  public static create(permissionBits: number): Result<UserPermission> {
    if (permissionBits < UserPermission.MINIMUM_PERMISSION_BITS_VALUE) {
      return Result.fail("Permission value must be greater than 0");
    }
    
    return Result.ok(new UserPermission(permissionBits));
  }
  
  public get value(): number {
    return this._value;
  }
}
