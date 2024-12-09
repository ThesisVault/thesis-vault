import { BadRequestError, UnexpectedError } from "@/shared/core/errors";
import { v4 as uuid } from "uuid";
import { RoleFactory } from "../../domain/models/role/factory";
import {
	type IRoleAuditLogService,
	RoleAuditLogService,
} from "../../domain/services/roleAuditLogService";
import type { CreateRoleDTO } from "../../dtos/roleDTO";
import { type IRoleRepository, RoleRepository } from "../../repositories/roleRepository";

export class CreateRoleUseCase {
	private _roleRepository: IRoleRepository;
	private _roleAuditLogService: IRoleAuditLogService;

	public constructor(
		roleRepository = new RoleRepository(),
		roleAuditLogService = new RoleAuditLogService(),
	) {
		this._roleRepository = roleRepository;
		this._roleAuditLogService = roleAuditLogService;
	}

	public async execute(request: CreateRoleDTO) {
		const roleOrFailure = RoleFactory.create({
			id: uuid(),
			name: request.name,
			permissions: request.permissions,
			color: request.color,
			createdAt: new Date(),
			updatedAt: null,
			isDeleted: false,
			deletedAt: null,
		});
    
		if (roleOrFailure.isFailure) {
			throw new BadRequestError(`failed to create role ${roleOrFailure.getErrorMessage}`);
		}
		const role = await this._roleRepository.createRole(roleOrFailure.getValue());

		if (role === null) {
			throw new UnexpectedError("Unexpected error occurred while saving the created role");
		}

		this._auditRoleCreation(request.requestedById, role?.id);

		return role.id;
	}

	private async _auditRoleCreation(userId: string, roleId: string): Promise<void> {
		await this._roleAuditLogService.createAndSaveRoleAuditLog({
			userId: userId,
			roleId: roleId,
			description: `Create Role with ID: ${roleId}`,
			type: "CREATE",
		});
	}
}
/**
 * id: string;
	name: string;
	permissions: number;
	color: string;
	createdAt: Date;
	updatedAt: Date;
	isDeleted: boolean;
	deletedAt: Date | null; 
 * 
 */
