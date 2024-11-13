import { User } from "./classes/user";
import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";
import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { Result } from "@/shared/core/result";

export interface IUserFactory {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  permissions: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserFactory {
  public static create(userFactoryProps: IUserFactory): Result<User> {
    const userNameOrError = UserName.create(userFactoryProps.name);
    const userRoleOrError = UserRole.create(userFactoryProps.role);
    const userPermissionOrError = UserPermission.create(userFactoryProps.permissions);
    
    const guardResult = Result.combine(
      [userNameOrError, userRoleOrError, userPermissionOrError]
    );
    if (guardResult.isFailure) return guardResult;
    
    return Result.ok<User>(User.create({
      ...userFactoryProps,
      name: userNameOrError.getValue(),
      role: userRoleOrError.getValue(),
      permissions: userPermissionOrError.getValue(),
    }));
  }
}
