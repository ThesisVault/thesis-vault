import type { IUserAuditLog } from "../../domain/models/userAuditLog/classes/userAuditLog";
import type { GetUserAuditLogsWithPaginationDTO } from "../../dtos/userAuditLogDTO";
import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "../../repositories/userAuditLogRepository";

export interface GetUserAuditLogsByPaginationResponseDTO {
	logs: IUserAuditLog[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	page: number;
	totalPages: number;
}

export class GetUserAuditLogsWithPaginationUseCase {
	private _userAuditLogRepository: IUserAuditLogRepository;

	constructor(userAuditLogRepository: IUserAuditLogRepository = new UserAuditLogRepository()) {
		this._userAuditLogRepository = userAuditLogRepository;
	}

	public async execute(
		request: GetUserAuditLogsWithPaginationDTO,
	): Promise<GetUserAuditLogsByPaginationResponseDTO> {
		const { perPage, page } = request;

		const logs = await this._userAuditLogRepository.getUserAuditLogsWithPagination({
			skip: (page - 1) * perPage,
			size: perPage,
		});

		const totalPages = await this._userAuditLogRepository.getUserAuditLogTotalPage(perPage);

		return {
			logs,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1,
			page,
			totalPages,
		};
	}
}
