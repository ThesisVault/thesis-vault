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
	private userRepository: IUserRepository;
	private roleRepository: IRoleRepository;

	constructor(userRepository = new UserRepository(), roleRepository = new RoleRepository()) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	public async getUserById(userId: string) {
		const user = await this.userRepository.getUserById(userId);
		if (user === null) {
			throw new NotFoundError(`User ${userId} not found`);
		}
		return user;
	}

	public async getRoleById(roleId: string) {	
		const role = await this.roleRepository.getRoleById(roleId);
		if (role === null) {
			throw new NotFoundError(`Role ${roleId} not found`);
		}
		return role;
	}

	public async updateUser(user: IUser) {
		const updatedUser = await this.userRepository.updateUser(user);
		if (updatedUser === null) {
			throw new Error("Unexpected error occurred while saving the updated user");
		}
		return updatedUser;
	}

	public async execute(request: UpdateUserRoleIdDTO): Promise<string> {
		const user = await this.getUserById(request.userId);
		const role = await this.getRoleById(request.roleId);

		user.updateRoleId(request.roleId);
		const updatedUser = await this.updateUser(user);

		return updatedUser.id;
	}
}
