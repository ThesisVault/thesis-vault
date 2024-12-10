import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import type { IRole } from "../../domain/models/role/classes/role";

export class GetRolesUseCase {
	private _roleRepository: IRoleRepository;

	public constructor(roleRepository = new RoleRepository()) {
		this._roleRepository = roleRepository;
	}

	public async execute(): Promise<IRole[]> {
		const role = await this._roleRepository.getRoles();

		return role;
	}
}
