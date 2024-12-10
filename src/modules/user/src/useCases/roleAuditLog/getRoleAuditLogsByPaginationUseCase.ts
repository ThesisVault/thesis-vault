import type { GetRoleAuditLogsByPaginationDTO } from "@/modules/user/src/dtos/roleAuditLogDTO";
import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import type { IRoleAuditLog } from "../../domain/models/roleAuditLog/classes/roleAuditLog";

export interface GetRoleAuditLogsByPaginationResponseDTO {
	auditLogs: IRoleAuditLog[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	page: number;
	totalPages: number;
}

export class GetRoleAuditLogsByPaginationUseCase {
	private _roleAuditLogRepository: IRoleAuditLogRepository;

	constructor(roleAuditLogRepository = new RoleAuditLogRepository()) {
		this._roleAuditLogRepository = roleAuditLogRepository;
	}

	public async execute(
		dto: GetRoleAuditLogsByPaginationDTO,
	): Promise<GetRoleAuditLogsByPaginationResponseDTO> {
		const { perPage, page } = dto;

		const auditLogs = await this._roleAuditLogRepository.getRoleAuditLogsByPagination({
			skip: (page - 1) * perPage,
			size: perPage,
		});

		const totalPages = await this._roleAuditLogRepository.getRoleAuditLogsTotalPages(perPage);

		return {
			auditLogs,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1,
			page,
			totalPages,
		};
	}
}
