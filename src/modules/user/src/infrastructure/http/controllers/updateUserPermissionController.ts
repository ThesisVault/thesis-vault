import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";
import { UpdateUserPermissionUseCase } from "@/modules/user/src/useCases/updateUserPermissionUseCase";
import type { UserDTO, UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { UserPermissionService } from "@/modules/user/src/domain/models/user/service/userPermissionService";
import { UnauthorizedError } from "@/shared/core/errors";

export class UpdateUserPermissionController extends BaseController<UpdateUserPermissionDTO, UserDTO> {
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
  
  protected async executeImpl(request: UpdateUserPermissionDTO): Promise<UserDTO> {
    const canEditorEdit = await this.userPermissionService.hasPermission(request.userToEditId, "MANAGE_PERMISSION");
    if (!canEditorEdit) {
      throw new UnauthorizedError("You do not have the required permissions to modify this user's permissions.");
    }
    
    const updatedUser = await this.updateUserPermissionUseCase.execute(request);
    return this.ok(updatedUser);
  }
}
