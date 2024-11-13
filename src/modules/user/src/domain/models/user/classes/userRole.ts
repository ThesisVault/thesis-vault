import { Result } from "@/shared/core/result";
import { Roles } from "@/shared/lib/types";

export class UserRole {
  private constructor(private readonly _value: Roles) {
    this._value = _value;
  }
  
  public static create(userRole: string): Result<UserRole> {
    const roles = Object.values(Roles);
    
    if (!roles.includes(userRole as Roles)) {
      return Result.fail(`${userRole} is not in ${roles}`);
    }
    
    return Result.ok(new UserRole(userRole as Roles));
  }
  
  public get value(): Roles {
    return this._value;
  }
}
