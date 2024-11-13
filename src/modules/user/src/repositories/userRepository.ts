import { db } from "@/shared/infrastructure/database";
import type { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import type { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import type { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";

export interface IUserRepository {
  getUserById(userId: string): Promise<User>;
  updateUser(user: User): Promise<User>;
  getUserPermissionBits(userId: string): Promise<number>;
  updateUserPermission(userId: string, permissions: UserPermission): Promise<User>;
  updateUserName(userId: string, name: UserName): Promise<User>;
}

export class UserRepository implements IUserRepository {
  async getUserById(userId: string): Promise<User> {
    const userRaw = await db.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    return UserMapper.toDomain(userRaw);
  }

  async getUserPermissionBits(userId: string): Promise<number> {
    const { permissions } = await db.user.findFirstOrThrow({
      select: {
        permissions: true
      },
      where: {
        id: userId
      }
    })

    return permissions;
  }

  async updateUser(user: User): Promise<User> {
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(updatedUser);
  }
  
  async updateUserName(userId: string, name: UserName): Promise<User> {
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name.value
      },
    });
    
    return UserMapper.toDomain(updatedUser);
  }
  
  async updateUserPermission(userId: string, permission: UserPermission): Promise<User> {
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        permissions: permission.value
      },
    });
    
    return UserMapper.toDomain(updatedUser);
  }
}
