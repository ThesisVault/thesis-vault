import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import type {
	IUserRawObject,
	IUserSchemaObject,
} from "@/modules/user/src/domain/models/user/constant";
import { UserFactory } from "@/modules/user/src/domain/models/user/factory";

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
			permissions: user.permissions.value,
			role: user.role.value,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
