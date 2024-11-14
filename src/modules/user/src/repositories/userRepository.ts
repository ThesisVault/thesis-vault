import { db } from "@/shared/infrastructure/database";
import type { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";

export interface IUserRepository {
  getUserById(userId: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  async getUserById(userId: string): Promise<User | null> {
    const users = await this.getUsersByIds([userId]);
    
    if (users.length === 0) {
      return null
    }

    return users[0];
  }
  
  async getUsersByIds(userIds: string[]): Promise<User[]> {
    const usersRaw = await db.user.findMany({
      where: {
        id: {
          in: userIds,
        }
      }
    })
    
    return usersRaw.map<User>(user => UserMapper.toDomain(user));
  }
}
