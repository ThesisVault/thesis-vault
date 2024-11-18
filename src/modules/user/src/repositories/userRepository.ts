import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import type { QueryOptions } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

export interface IUserRepository {
	getUserById(userId: string, options?: QueryOptions): Promise<IUser | null>;
	getUsersByIds(userIds: string[], options?: QueryOptions): Promise<IUser[]>;
}

export class UserRepository implements IUserRepository {
	private _userDatabase;
	private _userMapper;

	constructor(userDatabase = db.user, userMapper = UserMapper) {
		this._userDatabase = userDatabase;
		this._userMapper = userMapper;
	}

	async getUserById(userId: string, options?: QueryOptions): Promise<IUser | null> {
		const users = await this.getUsersByIds([userId], options);

		if (users.length === 0) {
			return null;
		}

		return users[0];
	}

	async getUsersByIds(userIds: string[], options?: QueryOptions): Promise<IUser[]> {
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

	private _deletedUserFilter(includeDeleted?: boolean) {
		if (includeDeleted) return {};

		return {
			isDeleted: false,
		};
	}
}
