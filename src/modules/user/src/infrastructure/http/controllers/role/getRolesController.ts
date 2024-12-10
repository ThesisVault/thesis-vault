import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import { UserPermissionService } from "@/modules/user/src/domain/services/userPermissionService";
import type { GetRolesDTO } from "@/modules/user/src/dtos/roleDTO";
import { GetRolesUseCase } from "@/modules/user/src/useCases/role/getRolesUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetRolesController extends BaseController<GetRolesDTO, IRole[]> {
	private _getRolesUseCase: GetRolesUseCase;
	private _userPermissionService: UserPermissionService;

	constructor(
		getRolesUseCase = new GetRolesUseCase(),
		userPermissionService = new UserPermissionService(),
	) {
		super();
		this._getRolesUseCase = getRolesUseCase;
		this._userPermissionService = userPermissionService;
	}

	public async executeImpl(request: GetRolesDTO): Promise<IRole[]> {
		const hasManagePermissionPermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_ROLE",
		);
		if (!hasManagePermissionPermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_ROLE permission`,
			);
		}

		const roles = await this._getRolesUseCase.execute();

		return this.ok(roles);
	}
}
