import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import { RoleMapper } from "@/modules/user/src/mappers/roleMapper";
import type { QueryOptions } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

export interface IRoleRepository {
	getRoleById(roleId: string, options?: QueryOptions): Promise<IRole | null>;
	getRolesByIds(roleIds: string[], options?: QueryOptions): Promise<IRole[]>;
}

export class RoleRepository {
	private _roleDatabase;
	private _roleMapper;

	constructor(roleDatabase = db.role, roleMapper = RoleMapper) {
		this._roleDatabase = roleDatabase;
		this._roleMapper = roleMapper;
	}

	async getRoleById(roleId: string, options?: QueryOptions): Promise<IRole | null> {
		const roles = await this.getRolesByIds([roleId], options);

		if (roles.length === 0) {
			return null;
		}

		return roles[0];
	}

	async getRolesByIds(roleIds: string[], options?: QueryOptions): Promise<IRole[]> {
		const usersRaw = await this._roleDatabase.findMany({
			where: {
				id: {
					in: roleIds,
				},
				...this._deletedRoleFilter(options?.includeDeleted),
			},
		});

		return usersRaw.map((user) => this._roleMapper.toDomain(user));
	}

	private _deletedRoleFilter(includeDeleted?: boolean) {
		if (includeDeleted) return {};

		return {
			isDeleted: false,
		};
	}
}
