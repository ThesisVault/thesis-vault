import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IUserAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";

export class UserAuditLogMapper {
	public static toDomain(rawData: IUserAuditLogRawObject): IUserAuditLog {
		return UserAuditLogFactory.create(rawData).getValue();
	}

	public static toPersistence(userAuditLog: IUserAuditLog): IUserAuditLogRawObject {
		return {
			id: userAuditLog.id,
			userId: userAuditLog.userId,
			type: userAuditLog.type.value,
			description: userAuditLog.description,
			createdAt: userAuditLog.createdAt,
		};
	}
}
