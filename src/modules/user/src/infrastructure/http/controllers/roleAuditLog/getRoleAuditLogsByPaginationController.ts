import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { GetRoleAuditLogsByPaginationDTO } from "@/modules/user/src/dtos/roleAuditLogDTO";
import {
	type GetRoleAuditLogsByPaginationResponseDTO,
	GetRoleAuditLogsByPaginationUseCase,
} from "@/modules/user/src/useCases/roleAuditLog/getRoleAuditLogsByPaginationUseCase"
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetRoleAuditLogsByPaginationController extends BaseController<
	GetRoleAuditLogsByPaginationDTO,
	GetRoleAuditLogsByPaginationResponseDTO
> {
	private _getRoleAuditLogsByPaginationUseCase: GetRoleAuditLogsByPaginationUseCase;
	private _userPermissionService: IUserPermissionService;

	constructor(
		getRoleAuditLogsByPaginationUseCase = new GetRoleAuditLogsByPaginationUseCase(),
		userPermissionService = new UserPermissionService(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._getRoleAuditLogsByPaginationUseCase = getRoleAuditLogsByPaginationUseCase;
	}

	public async executeImpl(
		request: GetRoleAuditLogsByPaginationDTO,
	): Promise<GetRoleAuditLogsByPaginationResponseDTO> {
		const hasManageRolePermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_ROLE",
		);

		if (!hasManageRolePermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
			);
		}

		const response = await this._getRoleAuditLogsByPaginationUseCase.execute(request);
		return this.ok(response);
	}
}
