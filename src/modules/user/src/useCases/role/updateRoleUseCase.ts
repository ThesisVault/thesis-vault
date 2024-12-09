import { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";
import type { UpdateRoleDTO } from "@/modules/user/src/dtos/userDTO";
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

		const updatedNameResult = RoleName.create(request.name);
		if (updatedNameResult.isFailure) {
			throw new BadRequestError(updatedNameResult.getErrorMessage()!);
		}

		const updatedPermissionsResult = RolePermission.create(request.permissions);
		if (updatedPermissionsResult.isFailure) {
			throw new BadRequestError(updatedPermissionsResult.getErrorMessage()!);
		}

		role.updateRole(
			updatedNameResult.getValue(),
			updatedPermissionsResult.getValue(),
			request.color,
		);
		const updatedRole = await this._roleRepository.updateRole(role);
		if (updatedRole === null) {
			throw new UnexpectedError("Unexpected error occurred while saving the updated role");
		}

		return updatedRole.id;
	}
}
