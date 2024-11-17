import { type IUserRepository, UserRepository } from "@/modules/user/src/repositories/userRepository";
import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import { type PermissionKeys, Permissions } from "@/modules/user/src/domain/models/user/shared/permission/permissions";

export class UserPermissionService {
  private userRepository: IUserRepository;
  
  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }
  
  async hasPermission(userIdOrUser: string | IUser, permission: PermissionKeys): Promise<boolean> {
    const user = (typeof userIdOrUser === "string")
      ? await this.userRepository.getUserById(userIdOrUser)
      : userIdOrUser;
    
    if (user === null) {
      return false;
    }
    
    return !!(user.permissionsValue & Permissions[permission]);
  }
}
