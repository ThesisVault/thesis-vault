import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import {
	type IUserAuditLogService,
	UserAuditLogService,
} from "@/modules/user/src/domain/services/userAuditLogService";
import type { DeleteUserDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { NotFoundError, UnexpectedError } from "@/shared/core/errors";

export class DeleteUserUseCase {
	private _userRepository: IUserRepository;
	private _userAuditLogService: IUserAuditLogService;

	public constructor(
		userRepository = new UserRepository(),
		userAuditLogService = new UserAuditLogService()
	) {
		this._userRepository = userRepository;
		this._userAuditLogService = userAuditLogService;
	}

	public async execute(request: DeleteUserDTO): Promise<string> {
		const user = await this._getUserById(request.userId);
		const deletedUser = await this._softDeleteUser(user);

		await this._auditUserDeletion(user, request.requestedById);
		
		return deletedUser.id;
	}
	
	private async _getUserById(userId: string): Promise<IUser> {
		const user = await this._userRepository.getUserById(userId);
		if (user === null) {
			throw new NotFoundError(`User ${userId} not found`);
		}
		
		return user;
	}
	
	private async _softDeleteUser(user: IUser): Promise<IUser> {
		user.softDelete();
		
		const deletedUser = await this._userRepository.updateUser(user);
		if (deletedUser === null) {
			throw new UnexpectedError("Unexpected error occurred while saving user");
		}
		
		return deletedUser;
	}

	private async _auditUserDeletion(user: IUser, requestedById: string): Promise<void> {
		await this._userAuditLogService.createAndSaveUserAuditLog({
			userId: requestedById,
			description: `Deleted User with ID: ${user.id}`,
			type: "DELETE",
		});
	}
}
