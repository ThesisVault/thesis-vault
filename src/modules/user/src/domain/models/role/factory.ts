import { Role } from "@/modules/user/src/domain/models/role/classes/role";
import { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";
import { Result } from "@/shared/core/result";

export interface IRoleFactory {
	id: string;
	name: string;
	permissions: number;
	color: string;
	createdAt: Date;
	updatedAt: Date;
	isDeleted: boolean;
	deletedAt: Date | null;
}

export class RoleFactory {
	public static create(props: IRoleFactory): Result<Role> {
		const nameOrError = RoleName.create(props.name);
		const permissionOrError = RolePermission.create(props.permissions);

		const guardResult = Result.combine([nameOrError, permissionOrError]);
		if (guardResult.isFailure) return guardResult;

		return Result.ok<Role>(
			Role.create({
				...props,
				name: nameOrError.getValue(),
				permissions: permissionOrError.getValue(),
				color: props.color,
			}),
		);
	}
}
