import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { GetUserAuditLogsByUserIdDTO } from "@/modules/user/src/dtos/userAuditLogDTO";
import { GetUserAuditLogsByUserIdUseCase } from "@/modules/user/src/useCases/userAuditLog/getUserAuditLogsByUserIdUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetUserAuditLogsByUserIdController extends BaseController<
	GetUserAuditLogsByUserIdDTO,
	IUserAuditLog[]
> {
	private _userPermissionService: IUserPermissionService;
	private _getUserAuditLogsByUserId: GetUserAuditLogsByUserIdUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		getUserAuditLogsByUserId = new GetUserAuditLogsByUserIdUseCase(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._getUserAuditLogsByUserId = getUserAuditLogsByUserId;
	}

	public async executeImpl(request: GetUserAuditLogsByUserIdDTO): Promise<IUserAuditLog[]> {
		const hasPermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"VIEW_USER_AUDIT_LOG",
		);
		if (!hasPermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have VIEW_USER_AUDIT_LOG permission`,
			);
		}

		const auditLogs = await this._getUserAuditLogsByUserId.execute(request);
		return this.ok(auditLogs);
	}
}
