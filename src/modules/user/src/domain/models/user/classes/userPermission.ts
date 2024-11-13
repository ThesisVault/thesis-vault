import { Result } from "@/shared/core/result";

export class UserPermission {
  private constructor(private readonly _value: number) {
    this._value = _value;
  }
  
  public static create(permissionBits: number): Result<UserPermission> {
    if (permissionBits < 0) {
      return Result.fail("Permission value must be greater than 0");
    }
    
    return Result.ok(new UserPermission(permissionBits));
  }
  
  public get value(): number {
    return this._value;
  }
}
