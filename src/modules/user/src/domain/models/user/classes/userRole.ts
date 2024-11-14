import { type Role, Roles } from "@/modules/user/src/domain/models/user/shared/permission/roles";
import { Result } from "@/shared/core/result";

export class UserRole {
	private readonly _value: Role;

	private constructor(value: Role) {
		this._value = value;
	}

	public static create(role: string): Result<UserRole> {
		if (!(role in Roles)) {
			return Result.fail(`${role} is not a valid role`);
		}

		return Result.ok(new UserRole(role as Role));
	}

	public get value(): Role {
		return this._value;
	}
}
