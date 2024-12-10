import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import { RoleMapper } from "@/modules/user/src/mappers/roleMapper";
import type { QueryOptions } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

export interface IRoleRepository {
	getRoleById(roleId: string, options?: QueryOptions): Promise<IRole | null>;
	getRoles(): Promise<IRole[]>;
	getRolesByIds(roleIds: string[], options?: QueryOptions): Promise<IRole[]>;
	updateRole(data: IRole): Promise<IRole | null>;
	updateRoles(roles: IRole[]): Promise<IRole[]>;
	createRole(role: IRole): Promise<IRole | null>;
	createRoles(roles: IRole[]): Promise<IRole[]>
}

export class RoleRepository implements IRoleRepository {
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

	async getRoles(): Promise<IRole[]> {
		const rolesRaw = await this._roleDatabase.findMany({});

		return rolesRaw.map((role) => this._roleMapper.toDomain(role));
	}

	async getRolesByIds(roleIds: string[], options?: QueryOptions): Promise<IRole[]> {
		const rolesRaw = await this._roleDatabase.findMany({
			where: {
				id: {
					in: roleIds,
				},
				...this._deletedRoleFilter(options?.includeDeleted),
			},
		});

		return rolesRaw.map((role) => this._roleMapper.toDomain(role));
	}

	async updateRole(data: IRole): Promise<IRole | null> {
		const updatedRole = await this.updateRoles([data]);

		if (updatedRole.length === 0) {
			return null;
		}

		return updatedRole[0];
	}

	async updateRoles(roles: IRole[]): Promise<IRole[]> {
		try {
			const updatedRolesPersistence = await db.$transaction(
				roles.map((role) => {
					return this._roleDatabase.update({
						data: RoleMapper.toPersistence(role),
						where: {
							id: role.id,
						},
					});
				}),
			);

			return updatedRolesPersistence.map((role) => RoleMapper.toDomain(role));
		} catch {
			return [];
		}
	}

	async createRole(role: IRole): Promise<IRole | null> {
		const roleDomains = await this.createRoles([role]);
		
		if (roleDomains.length === 0) {
			return null;
		}
		
		return roleDomains[0];
	}

	async createRoles(roles: IRole[]): Promise<IRole[]> {
		try {
			const rolesPersistence = await db.$transaction(
				roles.map((role) => {
					return this._roleDatabase.create({
						data: RoleMapper.toPersistence(role),
					});
				}),
			);
			
			return rolesPersistence.map(role => RoleMapper.toDomain(role));
		} catch {
			return [];
		}
	}


	private _deletedRoleFilter(includeDeleted?: boolean) {
		if (includeDeleted) return {};

		return {
			isDeleted: false,
		};
	}
}
