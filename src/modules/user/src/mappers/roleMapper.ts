import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import type {
	IRoleRawObject,
	IRoleSchemaObject,
} from "@/modules/user/src/domain/models/role/constant";
import { RoleFactory } from "@/modules/user/src/domain/models/role/factory";

export class RoleMapper {
	public static toDomain(rawData: IRoleRawObject): IRole {
		return RoleFactory.create(rawData).getValue();
	}

	public static toPersistence(role: IRole): IRoleSchemaObject {
		return {
			id: role.id,
			name: role.name.value,
			permissions: role.permissionsValue,
			createdAt: role.createdAt,
			updatedAt: role.updatedAt,
		};
	}
}
