import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { NotFoundError } from "@/shared/core/errors";

export class UpdateUserRoleIdUseCase {
	private _userRepository: IUserRepository;
	private _roleRepository: IRoleRepository;

	constructor(userRepository = new UserRepository(), roleRepository = new RoleRepository()) {
		this._userRepository = userRepository;
		this._roleRepository = roleRepository;
	}

	public async execute(request: UpdateUserRoleIdDTO): Promise<string> {
		await this._ensureRoleIdExists(request.roleId);

		const user = await this._getUserById(request.userId);
		const updatedUser = await this._updateUser(user, request.roleId);

		return updatedUser.id;
	}

	private async _getUserById(userId: string) {
		const user = await this._userRepository.getUserById(userId);
		if (user === null) {
			throw new NotFoundError(`User ${userId} not found`);
		}
		return user;
	}

	private async _ensureRoleIdExists(roleId: string | null): Promise<void> {
		if (roleId === null) return;

		const role = await this._roleRepository.getRoleById(roleId);
		if (role === null) {
			throw new NotFoundError(`Role ${roleId} not found`);
		}
	}

	private async _updateUser(user: IUser, roleId: string | null): Promise<IUser> {
		user.updateRoleId(roleId);

		const updatedUser = await this._userRepository.updateUser(user);
		if (updatedUser === null) {
			throw new Error("Unexpected error occurred while saving the updated user");
		}
		return updatedUser;
	}
}
