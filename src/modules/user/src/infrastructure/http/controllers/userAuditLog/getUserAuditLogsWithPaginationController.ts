import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { GetUserAuditLogsWithPaginationDTO } from "@/modules/user/src/dtos/userAuditLogDTO";
import {
	type GetUserAuditLogsByPaginationResponseDTO,
	GetUserAuditLogsWithPaginationUseCase,
} from "@/modules/user/src/useCases/userAuditLog/getUserAuditLogsWithPaginationUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetUserAuditLogsWithPaginationController extends BaseController<
	GetUserAuditLogsWithPaginationDTO,
	GetUserAuditLogsByPaginationResponseDTO
> {
	private _userPermissionService: IUserPermissionService;
	private _getUserAuditLogWithPaginationUseCase: GetUserAuditLogsWithPaginationUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		getUserAuditLogWithPaginationUseCase = new GetUserAuditLogsWithPaginationUseCase(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._getUserAuditLogWithPaginationUseCase = getUserAuditLogWithPaginationUseCase;
	}
	public async executeImpl(
		request: GetUserAuditLogsWithPaginationDTO,
	): Promise<GetUserAuditLogsByPaginationResponseDTO> {
		const hasPermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"VIEW_USER_AUDIT_LOG",
		);
		if (!hasPermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have VIEW_USER_AUDIT_LOG permission`,
			);
		}

		const response = await this._getUserAuditLogWithPaginationUseCase.execute(request);
		return this.ok(response);
	}
}
