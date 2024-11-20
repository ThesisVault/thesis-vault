import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/updateUserRoleIdDTO";
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

	public async execute(request: UpdateUserRoleIdDTO): Promise<string> {
		const user = await this.userRepository.getUserById(request.userId);
		if (user === null) {
			throw new NotFoundError(`User ${request.userId} not found`);
		}

		const role = await this.roleRepository.getRoleById(request.roleId);
		if (role === null) {
			throw new NotFoundError(`Role ${request.roleId} not found`);
		}

		user.updateRoleId(request.roleId);

		const updatedUser = await this.userRepository.updateUser(user);

		if (updatedUser === null) {
			throw new Error("Unexpected error occurred while saving the updated user");
		}

		return updatedUser.id;
	}
}