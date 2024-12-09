import { Result } from "@/shared/core/result";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { UserAuditLog } from "./classes/userAuditLog";
import { UserAuditLogType } from "./classes/userAuditLogType";

export interface IUserAuditLogFactory {
	id?: string;
	userId: string;
	type: string;
	description: string;
	createdAt: Date;
}

export class UserAuditLogFactory {
	public static create(userAuditLogFactoryProps: IUserAuditLogFactory): Result<UserAuditLog> {
		const typeOrError = UserAuditLogType.create(userAuditLogFactoryProps.type);

		const guardResult = Result.combine([typeOrError]);
		if (guardResult.isFailure) return guardResult;

		return Result.ok<UserAuditLog>(
			UserAuditLog.create({
				...userAuditLogFactoryProps,
				id: defaultTo(uuid(), userAuditLogFactoryProps.id),
				type: typeOrError.getValue(),
			}),
		);
	}
}
