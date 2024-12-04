import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { GetRoleByIdDTO } from "@/modules/user/src/dtos/userDTO";
import { GetRoleByIdUseCase } from "@/modules/user/src/useCases/role/getRoleByIdUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetRoleByIdController extends BaseController<GetRoleByIdDTO, string> {
	private _userPermissionService: IUserPermissionService;
	private _getRoleByIdUseCase: GetRoleByIdUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		getRoleByIdUseCase = new GetRoleByIdUseCase(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._getRoleByIdUseCase = getRoleByIdUseCase;
	}

	public async executeImpl(request: GetRoleByIdDTO): Promise<string> {
		const hasManagePermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_ROLE",
		);
		if (!hasManagePermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
			);
		}

		const role = await this._getRoleByIdUseCase.execute(request);
		if (role === null) {
			return this.ok("null");
		}

		return this.ok(role);
	}
}
