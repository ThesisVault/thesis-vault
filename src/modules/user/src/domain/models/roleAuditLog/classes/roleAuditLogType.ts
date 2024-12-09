import { type IRoleAuditLogType, RoleAuditLogTypes } from "@/modules/user/src/domain/models/roleAuditLog/constant";
import { Result } from "@/shared/core/result";

export class RoleAuditLogType {
	public readonly _value: string;

	private constructor(value: string) {
		this._value = value;
	}

	public static create(type: string): Result<RoleAuditLogType> {
		if (!RoleAuditLogType._isRoleAuditLogTypeValid(type)) {
			return Result.fail<RoleAuditLogType>("Invalid audit log type.");
		}

		return Result.ok(new RoleAuditLogType(type));
	}

	public get value(): string {
		return this._value;
	}
	
	private static _isRoleAuditLogTypeValid(type: string): boolean {
		return Object.values(RoleAuditLogTypes).includes(type as IRoleAuditLogType);
	}
}
