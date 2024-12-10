import { RoleFactory } from "@/modules/user/src/domain/models/role/factory";
import type { UpdateRoleDTO } from "@/modules/user/src/dtos/roleDTO";
import { RoleRepository } from "@/modules/user/src/repositories/roleRepository";
import { BadRequestError, NotFoundError, UnexpectedError } from "@/shared/core/errors";

export class UpdateRoleUseCase {
	private _roleRepository: RoleRepository;

	constructor(roleRepository = new RoleRepository()) {
		this._roleRepository = roleRepository;
	}

	public async execute(request: UpdateRoleDTO): Promise<string> {
		const role = await this._roleRepository.getRoleById(request.roleId);
		if (role === null) {
			throw new NotFoundError(`Role ${request.roleId} was not found.`);
		}

		const updatedRoleResult = RoleFactory.create({
			...role,
			id: role.id,
			name: request.name,
			color: request.color,
			permissions: request.permissions,
		});
		if (updatedRoleResult.isFailure) {
			throw new BadRequestError(updatedRoleResult.getErrorMessage()!);
		}

		const updatedRole = await this._roleRepository.updateRole(updatedRoleResult.getValue());
		if (updatedRole === null) {
			throw new UnexpectedError("Unexpected error occurred while saving the updated role");
		}

		return updatedRole.id;
	}
}
