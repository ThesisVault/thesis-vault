import { Result } from "@/shared/core/result";

export class UserAuditLogDescription {
	private readonly _value: string;

	private constructor(value: string) {
		this._value = value;
	}

	public static create(description: string): Result<UserAuditLogDescription> {
		if (!description || description.length < 5) {
			return Result.fail<UserAuditLogDescription>("Description must be at least 5 characters.");
		}
		return Result.ok(new UserAuditLogDescription(description));
	}

	public get value(): string {
		return this._value;
	}
}
