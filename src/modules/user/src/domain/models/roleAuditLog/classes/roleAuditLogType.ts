import { Result } from "@/shared/core/result";

export class RoleAuditLogType {
	public readonly _value: string;
	public static readonly ROLE_AUDIT_LOG_TYPES = ["UPDATE", "CREATE", "DELETE"];

	private constructor(value: string) {
		this._value = value;
	}

	public static create(type: string): Result<RoleAuditLogType> {
		if (!RoleAuditLogType.ROLE_AUDIT_LOG_TYPES.includes(type)) {
			return Result.fail<RoleAuditLogType>("Invalid audit log type.");
		}

		return Result.ok(new RoleAuditLogType(type));
	}

	public get value(): string {
		return this._value;
	}
}
