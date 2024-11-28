import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type {
	IAuditLogRawObject,
} from "@/modules/user/src/domain/models/userAuditLog/constant";
import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";
import type { Prisma } from "@prisma/client";

export class UserAuditLogMapper {
	public static toDomain(rawData: IAuditLogRawObject): IUserAuditLog {
		return UserAuditLogFactory.create(rawData).getValue();
	}

	public static toPersistence(userAuditLog: IUserAuditLog): Prisma.UserAuditLogUncheckedCreateInput {
		return {
			id: userAuditLog.id,
			userId: userAuditLog.userId,
			type: userAuditLog.type.value,
			description: userAuditLog.description.value,
			createdAt: userAuditLog.createdAt,
		};
	}
}
