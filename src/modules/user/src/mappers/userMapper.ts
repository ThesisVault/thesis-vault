import type { User as UserPersistence } from "@prisma/client"
import type { User } from "@/modules/user/src/domain/models/user/classes/user"
import { UserFactory } from "@/modules/user/src/domain/models/user/factory";
import type { Prisma } from "@prisma/client";

export class UserMapper {
  public static toDomain(rawData: UserPersistence): User {
    return UserFactory.create(rawData).getValue();
  }
  
  public static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email,
      image: user.image,
      permissions: user.permissions.value,
      role: user.role.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
