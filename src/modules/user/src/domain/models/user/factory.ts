import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { Result } from "@/shared/core/result";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { User } from "./classes/user";

export interface IUserFactory {
	id?: string;
	name: string;
	email: string;
	image: string;
	roleId: string | null;
	isSuperAdmin: boolean;
	allowPermissions: number;
	denyPermissions: number;
	isDeleted: boolean;
	deletedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export class UserFactory {
	public static create(userFactoryProps: IUserFactory): Result<User> {
		const userNameOrError = UserName.create(userFactoryProps.name);
		const userAllowPermissionOrError = UserPermission.create(userFactoryProps.allowPermissions);
		const userDenyPermissionOrError = UserPermission.create(userFactoryProps.denyPermissions);

		const guardResult = Result.combine([
			userNameOrError,
			userAllowPermissionOrError,
			userDenyPermissionOrError,
		]);
		if (guardResult.isFailure) return guardResult;

		return Result.ok<User>(
			User.create({
				...userFactoryProps,
				id: defaultTo(uuid(), userFactoryProps.id),
				name: userNameOrError.getValue(),
				allowPermissions: userAllowPermissionOrError.getValue(),
				denyPermissions: userDenyPermissionOrError.getValue(),
			}),
		);
	}
}
