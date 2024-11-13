import { db } from "@/shared/infrastructure/database";
import type { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";

export interface IUserRepository {
  getUserById(userId: string): Promise<User>;
  updateUser(user: User): Promise<User>;
  getUserPermissionBits(userId: string): Promise<number>;
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
}
