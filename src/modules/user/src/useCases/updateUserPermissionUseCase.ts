import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { BadRequestError, NotFoundError, UnexpectedError } from "@/shared/core/errors";
import { type IUserRepository, UserRepository } from "@/modules/user/src/repositories/userRepository";
import type { UserDTO, UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";

export class UpdateUserPermissionUseCase {
  private userRepository: IUserRepository;
  
  public constructor(userRepository: IUserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }
  
  public async execute(request: UpdateUserPermissionDTO): Promise<UserDTO> {
    const user = await this.userRepository.getUserById(request.userToEditId);
    
    if (user === null) {
      throw new NotFoundError(`User ${request.userToEditId} not found`);
    }
    
    const newPermissionOrError = UserPermission.create(request.permissions);
    if (newPermissionOrError.isFailure) {
      throw new BadRequestError(`Failed to update permission ${newPermissionOrError.getErrorMessage()}`)
    }
    
    user.updateUserPermission(newPermissionOrError.getValue());
    
    const updatedUser = await this.userRepository.updateUser(user);
    if (updatedUser === null) {
      throw new UnexpectedError("Unexpected error occurred saving the updated user")
    }
    
    return {
      id: updatedUser.id,
      name: updatedUser.nameValue,
      email: updatedUser.email,
      permissions: updatedUser.permissionsValue,
      role: updatedUser.roleValue,
      image: updatedUser.image,
    };
  }
}
