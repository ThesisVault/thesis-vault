import { UserPermissionService } from "@/modules/user/src/domain/services/userPermissionService";
import type { UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { UpdateUserPermissionUseCase } from "@/modules/user/src/useCases/updateUserPermissionUseCase";
import { UnauthorizedError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class UpdateUserPermissionController extends BaseController<UpdateUserPermissionDTO, string> {
  private userPermissionService: UserPermissionService;
  private updateUserPermissionUseCase: UpdateUserPermissionUseCase;
  
  constructor(
    userPermissionService = new UserPermissionService(),
    updateUserPermissionUseCase = new UpdateUserPermissionUseCase()
  ) {
    super();
    this.userPermissionService = userPermissionService;
    this.updateUserPermissionUseCase = updateUserPermissionUseCase;
  }
  
  protected async executeImpl(request: UpdateUserPermissionDTO): Promise<string> {
    const hasManagePermission = await this.userPermissionService.hasPermission(request.requestedById, "MANAGE_PERMISSION");
    if (!hasManagePermission) {
      throw new UnauthorizedError(`User ${request.requestedById} does not have MANAGE_PERMISSION permission`);
    }
    
    const updatedUser = await this.updateUserPermissionUseCase.execute(request);
    return this.ok(updatedUser);
  }
}
