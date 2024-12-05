import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { UpdateUserPermissionUseCase } from "@/modules/user/src/useCases/user/updateUserPermissionUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class UpdateUserPermissionController extends BaseController<UpdateUserPermissionDTO, string> {
  private _userPermissionService: IUserPermissionService;
  private _updateUserPermissionUseCase: UpdateUserPermissionUseCase;
  
  constructor(
    userPermissionService = new UserPermissionService(),
    updateUserPermissionUseCase = new UpdateUserPermissionUseCase()
  ) {
    super();
    this._userPermissionService = userPermissionService;
    this._updateUserPermissionUseCase = updateUserPermissionUseCase;
  }
  
  public async executeImpl(request: UpdateUserPermissionDTO): Promise<string> {
    const hasManagePermission = await this._userPermissionService.hasPermission(request.requestedById, "MANAGE_PERMISSION");
    if (!hasManagePermission) {
      throw new ForbiddenError(`User ${request.requestedById} does not have MANAGE_PERMISSION permission`);
    }
    
    const userId = await this._updateUserPermissionUseCase.execute(request);
    return this.ok(userId);
  }
}
