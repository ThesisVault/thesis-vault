import { Result } from "@/shared/core/result";
import { UserAuditLog } from "./classes/userAuditLog";
import { UserAuditLogDescription } from "./classes/userAuditLogDescription";
import { UserAuditLogType } from "./classes/userAuditLogType";

export interface IUserAuditLogFactory {
	id: string;
	userId: string;
	type: string;
	description: string;
	createdAt: Date;
}

export class UserAuditLogFactory {
	public static create(userAuditLogFactoryProps: IUserAuditLogFactory): Result<UserAuditLog> {
		const typeOrError = UserAuditLogType.create(userAuditLogFactoryProps.type);
		const descriptionOrError = UserAuditLogDescription.create(userAuditLogFactoryProps.description);

		const guardResult = Result.combine([typeOrError, descriptionOrError]);
		if (guardResult.isFailure) return guardResult;

		return Result.ok<UserAuditLog>(
			UserAuditLog.create({
				...userAuditLogFactoryProps,
				type: typeOrError.getValue(),
				description: descriptionOrError.getValue(),
			}),
		);
	}
}
