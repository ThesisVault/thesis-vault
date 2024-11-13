import { Result } from "@/shared/core/result";

export class UserName {
  private constructor(private readonly _value: string) {
    this._value = _value;
  }
  
  public static create(userName: string): Result<UserName> {
    if (userName.length > 60) {
      return Result.fail("Username is limited to 60 characters long");
    }
    
    return Result.ok(new UserName(userName));
  }
  
  public get value(): string {
    return this._value;
  }
}
