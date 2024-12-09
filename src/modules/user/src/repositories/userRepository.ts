import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import type { QueryOptions } from "@/shared/constant";
import type { Pagination } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

export interface IUserRepository {
  getUserById(userId: string, options?: QueryOptions): Promise<IUser | null>;
  getUsersByIds(userIds: string[], options?: QueryOptions): Promise<IUser[]>;
  updateUser(data: IUser): Promise<IUser | null>;
  updateUsers(users: IUser[]): Promise<IUser[]>;
  getUsersByPagination(
    pagination: Pagination,
    options?: QueryOptions
  ): Promise<IUser[]>;
  getUsersTotalPages(
    perPage: number,
    includeDeleted?: boolean
  ): Promise<number>;
}

export class UserRepository implements IUserRepository {
  private _userDatabase;
  private _userMapper;

  constructor(userDatabase = db.user, userMapper = UserMapper) {
    this._userDatabase = userDatabase;
    this._userMapper = userMapper;
  }

  async getUserById(
    userId: string,
    options?: QueryOptions
  ): Promise<IUser | null> {
    const users = await this.getUsersByIds([userId], options);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  }

  async getUsersByIds(
    userIds: string[],
    options?: QueryOptions
  ): Promise<IUser[]> {
    const usersRaw = await this._userDatabase.findMany({
      where: {
        id: {
          in: userIds,
        },
        ...this._deletedUserFilter(options?.includeDeleted),
      },
    });

    return usersRaw.map((user) => this._userMapper.toDomain(user));
  }

  async updateUser(data: IUser): Promise<IUser | null> {
    const updatedUser = await this.updateUsers([data]);

    if (updatedUser.length === 0) {
      return null;
    }

    return updatedUser[0];
  }

  async updateUsers(users: IUser[]): Promise<IUser[]> {
    try {
      const updatedUsersPersistence = await db.$transaction(
        users.map((user) => {
          return this._userDatabase.update({
            data: UserMapper.toPersistence(user),
            where: {
              id: user.id,
            },
          });
        })
      );

      return updatedUsersPersistence.map((user) => UserMapper.toDomain(user));
    } catch {
      return [];
    }
  }

  async getUsersByPagination(
    pagination: Pagination,
    options?: QueryOptions
  ): Promise<IUser[]> {
    const usersRaw = await this._userDatabase.findMany({
      skip: pagination.skip,
      take: pagination.size,
      where: this._deletedUserFilter(options?.includeDeleted),
      orderBy: [{ createdAt: "asc" }],
    });

    return usersRaw.map((user) => this._userMapper.toDomain(user));
  }

  public async getUsersTotalPages(
    perPage: number,
    includeDeleted?: boolean
  ): Promise<number> {
    const totalCount = await this._userDatabase.count({
      where: this._deletedUserFilter(includeDeleted),
    });
    return Math.ceil(totalCount / perPage);
  }

  private _deletedUserFilter(includeDeleted?: boolean) {
    if (includeDeleted) return {};

    return {
      isDeleted: false,
    };
  }
}
