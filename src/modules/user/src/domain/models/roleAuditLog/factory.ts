import { Result } from "@/shared/core/result";
import { defaultTo } from "rambda";
import { type IRoleAuditLog, RoleAuditLog } from "./classes/roleAuditLog";
import { RoleAuditLogType } from "./classes/roleAuditLogType";
import { v4 as uuid } from "uuid";

export interface IRoleAuditLogFactory {
	id?: string;
	userId: string;
	type: string;
	description: string;
	createdAt: Date;
	roleId: string;
}

export class RoleAuditLogFactory {
	public static create(roleAuditLogProps: IRoleAuditLogFactory): Result<IRoleAuditLog> {
		const roleAuditLogTypeOrError = RoleAuditLogType.create(roleAuditLogProps.type);
		if (roleAuditLogTypeOrError.isFailure) {
			return Result.fail(roleAuditLogTypeOrError.getErrorMessage()!);
		}

		return Result.ok<IRoleAuditLog>(
			RoleAuditLog.create({
				...roleAuditLogProps,
				id: defaultTo(uuid(), roleAuditLogProps.id),
				type: roleAuditLogTypeOrError.getValue(),
			}),
		);
	}
}
