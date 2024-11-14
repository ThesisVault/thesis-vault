import { db } from "@/shared/infrastructure/database";
import type { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";

export interface IUserRepository {
  getUserById(userId: string): Promise<User>;
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
}
