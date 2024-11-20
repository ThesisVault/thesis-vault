import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/updateUserRoleIdDTO";
import { UpdateUserRoleIdUseCase } from "@/modules/user/src/useCases/updateUserRoleIdUseCase";
import { UnauthorizedError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class UpdateUserRoleIdController extends BaseController<UpdateUserRoleIdDTO, string> {
	private userPermissionService: IUserPermissionService;
	private updateUserRoleIdUseCase: UpdateUserRoleIdUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		updateUserRoleIdUseCase = new UpdateUserRoleIdUseCase(),
	) {
		super();
		this.userPermissionService = userPermissionService;
		this.updateUserRoleIdUseCase = updateUserRoleIdUseCase;
	}

	public async executeImpl(request: UpdateUserRoleIdDTO): Promise<string> {
		const hasManagePermission = await this.userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_PERMISSION",
		);
		if (!hasManagePermission) {
			throw new UnauthorizedError(
				`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
			);
		}

		const updatedUserId = await this.updateUserRoleIdUseCase.execute(request);
		return this.ok(updatedUserId);
	}
}