import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { GetUsersWithPaginationDTO } from "@/modules/user/src/dtos/userDTO";
import { GetUsersWithPaginationUseCase } from "@/modules/user/src/useCases/getUsersWithPaginationUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export interface GetUsersWithPaginationResponseDTO {
	users: IUser[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	page: number;
	totalPages: number;
}

export class GetUsersWithPaginationController extends BaseController<
	GetUsersWithPaginationDTO,
	GetUsersWithPaginationResponseDTO
> {
	private _getUsersWithPaginationUseCase: GetUsersWithPaginationUseCase;
	private _userPermissionService: IUserPermissionService;

	constructor(
		getUsersWithPaginationUseCase = new GetUsersWithPaginationUseCase(),
		userPermissionService = new UserPermissionService(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._getUsersWithPaginationUseCase = getUsersWithPaginationUseCase;
	}

	public async executeImpl(
		request: GetUsersWithPaginationDTO,
	): Promise<GetUsersWithPaginationResponseDTO> {
		const hasManageUserPermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_USER",
		);
		if (!hasManageUserPermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_USER permission`,
			);
		}

		const response = await this._getUsersWithPaginationUseCase.execute(request);
		return this.ok(response);
	}
}
