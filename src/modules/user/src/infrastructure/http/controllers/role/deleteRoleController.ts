import { RolePermissionService } from "@/modules/user/src/domain/services/rolePermissionService";
import type { DeleteRoleDTO } from "@/modules/user/src/dtos/userDTO";
import { DeleteRoleUseCase } from "@/modules/user/src/useCases/role/deleteRoleUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class DeleteRoleController extends BaseController<DeleteRoleDTO, string> {
	private _rolePermissionService: RolePermissionService;
	private _deleteRoleUseCase: DeleteRoleUseCase;

	constructor(
		rolePermissionService = new RolePermissionService(),
		deleteRoleUseCase = new DeleteRoleUseCase(),
	) {
		super();
		this._rolePermissionService = rolePermissionService;
		this._deleteRoleUseCase = deleteRoleUseCase;
	}

	public async executeImpl(request: DeleteRoleDTO): Promise<string> {
		const hasManageRolePermission = await this._rolePermissionService.hasPermission(
			request.requestedById,
			"MANAGE_ROLE",
		);

		if (!hasManageRolePermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
			);
		}

		const roleId = await this._deleteRoleUseCase.execute(request);
		return this.ok(roleId);
	}
}