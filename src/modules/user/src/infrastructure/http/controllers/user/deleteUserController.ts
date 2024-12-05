import {
  type IUserPermissionService,
  UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import type { DeleteUserDTO } from "@/modules/user/src/dtos/userDTO";
import { DeleteUserUseCase } from "@/modules/user/src/useCases/user/deleteUserUseCase";
import { ForbiddenError } from "@/shared/core/errors";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class DeleteUserController extends BaseController<
  DeleteUserDTO,
  string
> {
  private _userPermissionService: IUserPermissionService;
  private _deleteUserUseCase: DeleteUserUseCase;

  constructor(
    userPermissionService = new UserPermissionService(),
    deleteUserUseCase = new DeleteUserUseCase()
  ) {
    super();
    this._userPermissionService = userPermissionService;
    this._deleteUserUseCase = deleteUserUseCase;
  }

  public async executeImpl(request: DeleteUserDTO): Promise<string> {
    const hasDeleteUserPermission =
      await this._userPermissionService.hasPermission(
        request.requestedById,
        "DELETE_USER"
      );
    if (!hasDeleteUserPermission) {
      throw new ForbiddenError(
        `User ${request.requestedById} does not have DELETE_USER permission`
      );
    }

    const userId = await this._deleteUserUseCase.execute(request);
    return this.ok(userId);
  }
}
