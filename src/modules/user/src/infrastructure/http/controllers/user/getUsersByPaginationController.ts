import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { GetUsersByPaginationDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type GetUsersByPaginationResponseDTO,
	GetUsersByPaginationUseCase,
} from "@/modules/user/src/useCases/getUsersByPaginationUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetUsersByPaginationController extends BaseController<
	GetUsersByPaginationDTO,
	GetUsersByPaginationResponseDTO
> {
	private _getUsersByPaginationUseCase: GetUsersByPaginationUseCase;
	private _userPermissionService: IUserPermissionService;

	constructor(
		getUsersByPaginationUseCase = new GetUsersByPaginationUseCase(),
		userPermissionService = new UserPermissionService(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._getUsersByPaginationUseCase = getUsersByPaginationUseCase;
	}

	public async executeImpl(
		request: GetUsersByPaginationDTO,
	): Promise<GetUsersByPaginationResponseDTO> {
		const hasManageUserPermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_USER",
		);
		if (!hasManageUserPermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_USER permission`,
			);
		}

		const response = await this._getUsersByPaginationUseCase.execute(request);
		return this.ok(response);
	}
}
