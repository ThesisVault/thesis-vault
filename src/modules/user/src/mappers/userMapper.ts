import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import { UserFactory } from "@/modules/user/src/domain/models/user/factory";
import type {
	IUserRawObject,
	IUserSchemaObject,
} from "@/modules/user/src/domain/models/user/shared/constant";

export class UserMapper {
	public static toDomain(rawData: IUserRawObject): IUser {
		return UserFactory.create(rawData).getValue();
	}

	public static toPersistence(user: IUser): IUserSchemaObject {
		return {
			id: user.id,
			name: user.name.value,
			email: user.email,
			image: user.image,
			isSuperAdmin: user.isSuperAdmin,
			allowPermissions: user.allowPermissionsValue,
			denyPermissions: user.denyPermissionsValue,
			isDeleted: user.isDeleted,
			deletedAt: user.deletedAt,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
