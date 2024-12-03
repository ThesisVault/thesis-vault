import { Result } from "@/shared/core/result";

export class UserName {
	private readonly _value: string;
	public static readonly MAXIMUM_USERNAME_LENGTH = 60;

	private constructor(value: string) {
		this._value = value;
	}

	public static create(userName: string): Result<UserName> {
		if (userName.length > UserName.MAXIMUM_USERNAME_LENGTH) {
			return Result.fail(
				`Username is limited to ${UserName.MAXIMUM_USERNAME_LENGTH} characters long`,
			);
		}

		return Result.ok(new UserName(userName));
	}

	public get value(): string {
		return this._value;
	}
}
