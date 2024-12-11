import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { CreateRoleDTO } from "@/modules/user/src/dtos/roleDTO";
import { CreateRoleUseCase } from "@/modules/user/src/useCases/role/createRoleUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class CreateRoleController extends BaseController<CreateRoleDTO, string> {
	private _userPermissionService: IUserPermissionService;
	private _createRoleUseCase: CreateRoleUseCase;

	constructor(
		userPermissionService = new UserPermissionService(),
		createRoleUseCase = new CreateRoleUseCase(),
	) {
		super();
		this._userPermissionService = userPermissionService;
		this._createRoleUseCase = createRoleUseCase;
	}

	public async executeImpl(request: CreateRoleDTO): Promise<string> {
		const hasManageRolePermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_ROLE",
		);
		if (!hasManageRolePermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
			);
		}

		const roleId = await this._createRoleUseCase.execute(request);
		return this.ok(roleId);
	}
}
