import type { IRoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import type {
	IRoleAuditLogRawObject,
	IRoleAuditLogSchemaObject,
} from "@/modules/user/src/domain/models/roleAuditLog/constant";
import { RoleAuditLogFactory } from "@/modules/user/src/domain/models/roleAuditLog/factory";

export class RoleAuditLogMapper {
	public static toDomain(rawData: IRoleAuditLogRawObject): IRoleAuditLog {
		return RoleAuditLogFactory.create(rawData).getValue();
	}

	public static toPersistence(roleAuditLog: IRoleAuditLog): IRoleAuditLogSchemaObject {
		return {
			id: roleAuditLog.id,
			userId: roleAuditLog.userId,
			type: roleAuditLog.type.value,
			description: roleAuditLog.description,
			createdAt: roleAuditLog.createdAt,
			roleId: roleAuditLog.roleId,
		};
	}
}
