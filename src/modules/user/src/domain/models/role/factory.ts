import { Role } from "@/modules/user/src/domain/models/role/classes/role";
import { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";
import { Result } from "@/shared/core/result";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";

export interface IRoleFactory {
	id?: string;
	name: string;
	permissions: number;
	color: string;
	createdAt: Date;
	updatedAt?: Date | null;
	isDeleted: boolean;
	deletedAt: Date | null;
}

export class RoleFactory {
	public static create(props: IRoleFactory): Result<Role> {
		const updatedAt = props.updatedAt ? props.updatedAt : null;
		const nameOrError = RoleName.create(props.name);
		const permissionOrError = RolePermission.create(props.permissions);

		const guardResult = Result.combine([nameOrError, permissionOrError]);
		if (guardResult.isFailure) return guardResult;

		return Result.ok<Role>(
			Role.create({
				...props,
				id: defaultTo(uuid(), props.id),
				name: nameOrError.getValue(),
				permissions: permissionOrError.getValue(),
				color: props.color,
				updatedAt: updatedAt,
			}),
		);
	}
}
