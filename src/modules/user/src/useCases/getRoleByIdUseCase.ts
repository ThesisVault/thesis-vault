import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { NotFoundError } from "@/shared/core/errors";
import type { IRole } from "../domain/models/role/classes/role";
import type { GetRoleByIdDTO } from "../dtos/userDTO";

export class GetRoleByIdUseCase {
	private _roleRepository: IRoleRepository;

	public constructor(roleRepository = new RoleRepository()) {
		this._roleRepository = roleRepository;
	}

	public async execute(request: GetRoleByIdDTO): Promise<string | null> {
		await this._ensureRoleIdExists(request.roleId);

		if (request.roleId === null) {
			return null;
		}

		const role = await this._getRoleById(request.roleId);
		return role.id;
	}

	private async _getRoleById(roleId: string): Promise<IRole> {
		const role = await this._roleRepository.getRoleById(roleId);
		if (role === null) {
			throw new NotFoundError(`Role ${roleId} not found`);
		}
		return role;
	}

	private async _ensureRoleIdExists(roleId: string | null): Promise<void> {
		if (roleId === null) return;

		const role = await this._roleRepository.getRoleById(roleId);
		if (role === null) {
			throw new NotFoundError(`Role ${roleId} not found`);
		}
	}
}
