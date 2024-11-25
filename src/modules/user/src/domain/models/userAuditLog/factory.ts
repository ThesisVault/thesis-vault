import { Result } from "@/shared/core/result";
import { UserAuditLog } from "./classes/userAuditLog";

export interface IUserAuditLogFactory {
	id: string;
	userId: string;
	type: string;
	description: string;
	createdAt: Date;
}

export class UserAuditLogFactory {
	public static create(userAuditLogFactoryProps: IUserAuditLogFactory): Result<UserAuditLog> {
		if (!userAuditLogFactoryProps.type) {
			return Result.fail<UserAuditLog>("type is required.");
		}

		if (!userAuditLogFactoryProps.description) {
			return Result.fail<UserAuditLog>("description is required.");
		}

		if (!(userAuditLogFactoryProps.createdAt instanceof Date)) {
			return Result.fail<UserAuditLog>("createdAt must be a valid Date.");
		}

		return Result.ok<UserAuditLog>(
			UserAuditLog.create({
				...userAuditLogFactoryProps,
			}),
		);
	}
}
