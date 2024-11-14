import type { Prisma, User as UserPersistence } from "@prisma/client"
import type { IUser } from "@/modules/user/src/domain/models/user/classes/user"
import { UserFactory } from "@/modules/user/src/domain/models/user/factory";

export class UserMapper {
  public static toDomain(rawData: UserPersistence): IUser {
    return UserFactory.create(rawData).getValue();
  }
  
  public static toPersistence(user: IUser): Prisma.UserCreateInput {
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
