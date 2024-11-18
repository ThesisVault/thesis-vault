import { Permissions } from "@/modules/user/src/shared/permissions";
import { Result } from "@/shared/core/result";

export class RolePermission {
	private readonly _value: number;
	public static readonly MINIMUM_PERMISSION_BITS_VALUE = 0;
	public static readonly MAXIMUM_PERMISSION_BITS_VALUE = Permissions.ALL;

	private constructor(value: number) {
		this._value = value;
	}

	public static create(permissionBits: number): Result<RolePermission> {
		if (permissionBits < RolePermission.MINIMUM_PERMISSION_BITS_VALUE) {
			return Result.fail(
				`Permission value must be greater than or equal ${RolePermission.MINIMUM_PERMISSION_BITS_VALUE}`,
			);
		}

		if (permissionBits > RolePermission.MAXIMUM_PERMISSION_BITS_VALUE) {
			return Result.fail(
				`Permission value must be less than or equal ${RolePermission.MAXIMUM_PERMISSION_BITS_VALUE}`,
			);
		}

		return Result.ok(new RolePermission(permissionBits));
	}

	public get value(): number {
		return this._value;
	}
}
