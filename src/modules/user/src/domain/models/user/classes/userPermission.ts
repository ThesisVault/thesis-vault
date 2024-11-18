import { Permissions } from "@/modules/user/src/shared/permissions";
import { Result } from "@/shared/core/result";

export class UserPermission {
	private readonly _value: number;
	public static readonly MINIMUM_PERMISSION_BITS_VALUE = 0;
	public static readonly MAXIMUM_PERMISSION_BITS_VALUE = Permissions.ALL;

	private constructor(value: number) {
		this._value = value;
	}

	public static create(permissionBits: number): Result<UserPermission> {
		if (permissionBits < UserPermission.MINIMUM_PERMISSION_BITS_VALUE) {
			return Result.fail(
				`Permission value must be greater than or equal ${UserPermission.MINIMUM_PERMISSION_BITS_VALUE}`,
			);
		}

		if (permissionBits > UserPermission.MAXIMUM_PERMISSION_BITS_VALUE) {
			return Result.fail(
				`Permission value must be less than or equal ${UserPermission.MAXIMUM_PERMISSION_BITS_VALUE}`,
			);
		}

		return Result.ok(new UserPermission(permissionBits));
	}

	public get value(): number {
		return this._value;
	}
}
