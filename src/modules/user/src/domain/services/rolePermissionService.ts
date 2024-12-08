import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { type PermissionKeys, Permissions } from "@/modules/user/src/shared/permissions";
import { defaultTo } from "rambda";

export class RolePermissionService {
	private _roleRepository: IRoleRepository;

	constructor(roleRepository = new RoleRepository()) {
		this._roleRepository = roleRepository;
	}

	public async hasPermission(roleId: string, permission: PermissionKeys): Promise<boolean> {
		const role = await this._roleRepository.getRoleById(roleId);

		if (!role) {
			return false;
		}

		const permissions = defaultTo(0, role.permissionsValue);

		const permissionFlag = Permissions[permission];
		return (permissions & permissionFlag) === permissionFlag;
	}
}
