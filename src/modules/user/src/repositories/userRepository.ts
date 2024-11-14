import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { db } from "@/shared/infrastructure/database";

export interface IUserRepository {
	getUserById(userId: string): Promise<IUser | null>;
	getUsersByIds(userIds: string[]): Promise<IUser[]>;
}

export class UserRepository implements IUserRepository {
	async getUserById(userId: string): Promise<IUser | null> {
		const users = await this.getUsersByIds([userId]);

		if (users.length === 0) {
			return null;
		}

		return users[0];
	}

	async getUsersByIds(userIds: string[]): Promise<IUser[]> {
		const usersRaw = await db.user.findMany({
			where: {
				id: {
					in: userIds,
				},
			},
		});

		return usersRaw.map((user) => UserMapper.toDomain(user));
	}
}
