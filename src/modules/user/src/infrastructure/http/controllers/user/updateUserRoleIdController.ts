import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/userDTO";
import { UpdateUserRoleIdUseCase } from "@/modules/user/src/useCases/updateUserRoleIdUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class UpdateUserRoleIdController extends BaseController<UpdateUserRoleIdDTO, string> {
	private _userPermissionService: IUserPermissionService;
	private _updateUserRoleIdUseCase: UpdateUserRoleIdUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		updateUserRoleIdUseCase = new UpdateUserRoleIdUseCase(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._updateUserRoleIdUseCase = updateUserRoleIdUseCase;
	}

	public async executeImpl(request: UpdateUserRoleIdDTO): Promise<string> {
		const hasManagePermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_PERMISSION",
		);
		if (!hasManagePermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
			);
		}

		const updatedUserId = await this._updateUserRoleIdUseCase.execute(request);
		return this.ok(updatedUserId);
	}
}
