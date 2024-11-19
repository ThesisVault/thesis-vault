import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { type PermissionKeys, Permissions } from "@/modules/user/src/shared/permissions";
import { defaultTo } from "rambda";

export interface IUserPermissionService {
	hasPermission(userId: string, permission: PermissionKeys): Promise<boolean>;
	hasSuperAdmin(userId: string): Promise<boolean>;
}

export class UserPermissionService {
	private _userRepository: IUserRepository;
	private _roleRepository: IRoleRepository;

	constructor(userRepository = new UserRepository(), roleRepository = new RoleRepository()) {
		this._userRepository = userRepository;
		this._roleRepository = roleRepository;
	}

	public async hasPermission(userId: string, permission: PermissionKeys): Promise<boolean> {
		const hasSuperAdmin = await this.hasSuperAdmin(userId);
		if (hasSuperAdmin) {
			return true;
		}

		const user = await this._userRepository.getUserById(userId);
		if (user === null) {
			return false;
		}

		const userRole = await this._roleRepository.getRoleById(defaultTo("", user.roleId));

		let permissions = defaultTo(0, userRole?.permissionsValue);
		permissions &= ~user.denyPermissionsValue;
		permissions |= user.allowPermissionsValue;

		const permissionFlag = Permissions[permission];

		return (permissions & permissionFlag) === permissionFlag;
	}

	public async hasSuperAdmin(userId: string): Promise<boolean> {
		const user = await this._userRepository.getUserById(userId);
		if (!user) {
			return false;
		}

		return user.isSuperAdmin;
	}
}
