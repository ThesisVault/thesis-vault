import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import type { UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { BadRequestError, NotFoundError, UnexpectedError } from "@/shared/core/errors";

export class UpdateUserPermissionUseCase {
	private userRepository: IUserRepository;

	public constructor(userRepository = new UserRepository()) {
		this.userRepository = userRepository;
	}

	public async execute(request: UpdateUserPermissionDTO): Promise<string> {
		const user = await this.userRepository.getUserById(request.userId);
		if (user === null) {
			throw new NotFoundError(`User ${request.userId} not found`);
		}

		const allowedPermissionOrError = UserPermission.create(request.allowPermission);
		if (allowedPermissionOrError.isFailure) {
			throw new BadRequestError(
				`Failed to update permission ${allowedPermissionOrError.getErrorMessage()}`,
			);
		}

		const deniedPermissionOrError = UserPermission.create(request.denyPermission);
		if (deniedPermissionOrError.isFailure) {
			throw new BadRequestError(
				`Failed to update permission ${deniedPermissionOrError.getErrorMessage()}`,
			);
		}

		user.updatePermission(allowedPermissionOrError.getValue(), deniedPermissionOrError.getValue());

		const updatedUser = await this.userRepository.updateUser(user);
		if (updatedUser === null) {
			throw new UnexpectedError("Unexpected error occurred while saving the updated user");
		}

		return updatedUser.id;
	}
}
