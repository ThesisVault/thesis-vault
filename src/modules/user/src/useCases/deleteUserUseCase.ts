import {
	type IUserAuditLogService,
	UserAuditLogService,
} from "@/modules/user/src/domain/services/userAuditLogService";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { NotFoundError, UnexpectedError } from "@/shared/core/errors";

export class DeleteUserUseCase {
	private userRepository: IUserRepository;
	private userAuditLogService: IUserAuditLogService;

	public constructor(
		userRepository = new UserRepository(),
		userAuditLogService = new UserAuditLogService()
	) {
		this.userRepository = userRepository;
		this.userAuditLogService = userAuditLogService;
	}

	public async execute(request: { userId: string }): Promise<string> {
		const user = await this.userRepository.getUserById(request.userId);
		if (user === null) {
			throw new NotFoundError(`User ${request.userId} not found`);
		}

		user.softDelete();

		const deletedUser = await this.userRepository.updateUser(user);
		if (deletedUser === null) {
			throw new UnexpectedError("Unexpected error occurred while saving user");
		}

		await this.userAuditLogService.addUserAuditRecord({
			userId: user.id,
			description: "User soft deleted",
			type: "DELETE",
		});

		return deletedUser.id;
	}
}
