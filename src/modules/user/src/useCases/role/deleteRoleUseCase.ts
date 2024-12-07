import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import {
	type IRoleAuditLogService,
	RoleAuditLogService,
} from "@/modules/user/src/domain/services/roleAuditLogService"; // TODO: apply roleAuditLog here when RoleAuditLog is done

import type { DeleteRoleDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { NotFoundError, UnexpectedError } from "@/shared/core/errors";

export class DeleteRoleUseCase {
	private _roleRepository: IRoleRepository;
	private _roleAuditLogService: IRoleAuditLogService;

	public constructor(
		roleRepository = new RoleRepository(),
		roleAuditLogService = new RoleAuditLogService(),
	) {
		this._roleRepository = roleRepository;
		this._roleAuditLogService = roleAuditLogService;
	}

	public async execute(request: DeleteRoleDTO): Promise<string> {
		const role = await this._getRoleById(request.roleId);
		const deletedRole = await this._softDeleteRole(role);

		// await this._auditRoleDeletion(role, request.requestedById); // TODO: apply roleAuditLog here when RoleAuditLog is done

		return deletedRole.id;
	}

	private async _getRoleById(roleId: string): Promise<IRole> {
		const role = await this._roleRepository.getRoleById(roleId);
		if (role === null) {
			throw new NotFoundError(`Role ${roleId} not found`);
		}

		return role;
	}

	private async _softDeleteRole(role: IRole): Promise<IRole> {
		role.softDelete();

		const deletedRole = await this._roleRepository.updateRole(role);
		if (deletedRole === null) {
			throw new UnexpectedError("Unexpected error occurred while saving role");
		}

		return deletedRole;
	}

	/*private async _auditRoleDeletion(role: IRole, requestedById: string): Promise<void> {
		await this._roleAuditLogService.createAndSaveRoleAuditLog({
			userId: requestedById,
			description: `Deleted Role with ID: ${role.id}`,
			type: "DELETE",
		});
	}*/ // TODO: apply roleAuditLog here when RoleAuditLog is done
}
