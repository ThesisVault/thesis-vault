import { RoleAuditLogFactory } from "@/modules/user/src/domain/models/roleAuditLog/factory";
import type { CreateAndSaveRoleAuditLogDTO } from "@/modules/user/src/dtos/roleAuditLogDTO";
import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import { UnexpectedError } from "@/shared/core/errors";

export interface IRoleAuditLogService {
	createAndSaveRoleAuditLog(params: CreateAndSaveRoleAuditLogDTO): Promise<void>;
}

export class RoleAuditLogService implements IRoleAuditLogService {
	private _roleAuditLogRepository: IRoleAuditLogRepository;

	constructor(roleAuditLogRepository = new RoleAuditLogRepository()) {
		this._roleAuditLogRepository = roleAuditLogRepository;
	}

	public async createAndSaveRoleAuditLog(params: CreateAndSaveRoleAuditLogDTO): Promise<void> {
		const roleAuditLogOrError = RoleAuditLogFactory.create({
			userId: params.userId,
			type: params.type,
			createdAt: new Date(),
			description: params.description,
			roleId: params.roleId,
		});
		if (roleAuditLogOrError.isFailure) {
			throw new UnexpectedError("Unexpected error occurred while creating auditLog");
		}

		await this._roleAuditLogRepository.createRoleAuditLog(roleAuditLogOrError.getValue());
	}
}
