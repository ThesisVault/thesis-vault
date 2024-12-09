import type { PermissionsDetailType } from "@/modules/user/src/shared/permissions";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";
import {
	type IUserPermissionService,
	UserPermissionService,
} from "../../../../domain/services/userPermissionService";
import type { GetPermissionsDTO } from "../../../../dtos/permissionDTO";
import { GetPermissionsUseCase } from "../../../../useCases/permission/getPermissionsUseCase";

export class GetPermissionsController extends BaseController<
	GetPermissionsDTO,
	PermissionsDetailType
> {
	private _getPermissionsUseCase: GetPermissionsUseCase;
	private _userPermissionService: IUserPermissionService;

	constructor(
		getPermissionsUseCase = new GetPermissionsUseCase(),
		userPermissonService = new UserPermissionService(),
	) {
		super();
		this._userPermissionService = userPermissonService;
		this._getPermissionsUseCase = getPermissionsUseCase;
	}

	public async executeImpl(request: GetPermissionsDTO): Promise<PermissionsDetailType> {
		const hasManagePermissionPermission = await this._userPermissionService.hasPermission(
			request.requestedById,
			"MANAGE_PERMISSION",
		);
		if (!hasManagePermissionPermission) {
			throw new ForbiddenError(
				`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
			);
		}

		const permission = await this._getPermissionsUseCase.execute();
		return this.ok(permission);
	}
}
