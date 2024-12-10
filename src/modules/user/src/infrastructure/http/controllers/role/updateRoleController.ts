import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { UpdateRoleDTO } from "@/modules/user/src/dtos/roleDTO";
import { UpdateRoleUseCase } from "@/modules/user/src/useCases/role/updateRoleUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class UpdateRoleController extends BaseController<UpdateRoleDTO, string> {
	private _userPermissionService: IUserPermissionService;
	private _updateRoleUseCase: UpdateRoleUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		updateRoleUseCase = new UpdateRoleUseCase(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._updateRoleUseCase = updateRoleUseCase;
	}

	public async executeImpl(request: UpdateRoleDTO): Promise<string> {
		const hasManageRolePermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_ROLE",
		);

		if (!hasManageRolePermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
			);
		}

		const updatedRoleId = await this._updateRoleUseCase.execute(request);
		return this.ok(updatedRoleId);
	}
}
