import { Result } from "@/shared/core/result";

export class UserAuditLogType {
	public readonly _value: string;

	private constructor(value: string) {
		this._value = value;
	}

	public static create(type: string): Result<UserAuditLogType> {
		const validTypes = ["UPDATED", "CREATE", "DELETE"];
		if (!validTypes.includes(type)) {
			return Result.fail<UserAuditLogType>("Invalid audit log type.");
		}
		return Result.ok(new UserAuditLogType(type));
	}

	public get value(): string {
		return this._value;
	}
}
