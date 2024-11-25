import type { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type {
	IAuditLogRawObject,
	IAuditLogSchemaObject,
} from "@/modules/user/src/domain/models/userAuditLog/constant";
import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";

export class UserAuditLogMapper {
	public static toDomain(rawData: IAuditLogRawObject): UserAuditLog {
		return UserAuditLogFactory.create(rawData).getValue();
	}

	public static toPersistence(userAuditLog: UserAuditLog): IAuditLogSchemaObject {
		return {
			id: userAuditLog.id,
			user: { connect: { id: userAuditLog.userId } },
			type: userAuditLog.type,
			description: userAuditLog.description,
			createdAt: userAuditLog.createdAt,
		};
	}
}
