import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import type { GetRoleByIdDTO } from "../../dtos/userDTO";

export class GetRoleByIdUseCase {
	private _roleRepository: IRoleRepository;

	public constructor(roleRepository = new RoleRepository()) {
		this._roleRepository = roleRepository;
	}

	public async execute(request: GetRoleByIdDTO): Promise<string | null> {
		const role = await this._roleRepository.getRoleById(request.roleId);
		if (role === null) {
			return null;
		}
		return role.nameValue;
	}
}
