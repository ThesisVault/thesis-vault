import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { HasPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionUseCase } from "@/modules/user/src/useCases/userPermissionService/hasPermissionUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class HasPermissionController extends BaseController<HasPermissionDTO, boolean> {
	private _userPermissionService: IUserPermissionService;
	private _hasPermissionUseCase: HasPermissionUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		hasPermissionUseCase = new HasPermissionUseCase()
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._hasPermissionUseCase = hasPermissionUseCase;
	}

	public async executeImpl(request: HasPermissionDTO): Promise<boolean> {
		const requestedByPermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_PERMISSION",
		);
		if (!requestedByPermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
			);
		}

		const hasPermission = await this._hasPermissionUseCase.execute(request);
		return hasPermission;
	}
}
