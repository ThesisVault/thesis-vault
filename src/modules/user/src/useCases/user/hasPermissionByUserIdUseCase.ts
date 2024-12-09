import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { type PermissionKeys, Permissions } from "@/modules/user/src/shared/permissions";
import { NotFoundError } from "@/shared/core/errors";
import {
	type IUserPermissionService,
	UserPermissionService,
} from "../../domain/services/userPermissionService";
import type { HasPermissionByUserIdDTO } from "../../dtos/userDTO";

export class HasPermissionByUserIdUseCase {
	private _userRepository: IUserRepository;
	private _userPermissionService: IUserPermissionService;

	constructor(
		userRepository = new UserRepository(),
		userPermissionService = new UserPermissionService(),
	) {
		this._userRepository = userRepository;
		this._userPermissionService = userPermissionService;
	}

	async execute(request: HasPermissionByUserIdDTO): Promise<boolean> {
		const user = await this._userRepository.getUserById(request.userId);
		if (user === null) {
			throw new NotFoundError(`User with ID ${request.userId} not found`);
		}

		const permissionKey = this.getPermissionKey(request.permission);
		const hasPermission = await this._userPermissionService.hasPermission(user.id, permissionKey);

		return hasPermission;
	}

	private getPermissionKey(permissionsValue: number): PermissionKeys {
		const permissionKey = Object.keys(Permissions).find((key) => {
			return (
				(permissionsValue & Permissions[key as keyof typeof Permissions]) ===
				Permissions[key as keyof typeof Permissions]
			);
		});

		return permissionKey as PermissionKeys;
	}
}
