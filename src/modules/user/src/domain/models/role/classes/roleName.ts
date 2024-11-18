import { Result } from "@/shared/core/result";

export class RoleName {
	private readonly _value: string;
	public static readonly MAXIMUM_ROLE_NAME_LENGTH = 20;

	private constructor(value: string) {
		this._value = value;
	}

	public static create(name: string): Result<RoleName> {
		if (name.length > RoleName.MAXIMUM_ROLE_NAME_LENGTH) {
			return Result.fail(
				`Role name is limited to ${RoleName.MAXIMUM_ROLE_NAME_LENGTH} characters long`,
			);
		}

		return Result.ok(new RoleName(name));
	}

	public get value(): string {
		return this._value;
	}
}
