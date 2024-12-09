import { NotFoundError } from "@/shared/core/errors";
import type { IUserAuditLog } from "../../domain/models/userAuditLog/classes/userAuditLog";
import type { GetUserAuditLogsByUserIdDTO } from "../../dtos/userAuditLogDTO";
import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "../../repositories/userAuditLogRepository";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class GetUserAuditLogsByUserIdUseCase {
	private _userAuditLogRepository: IUserAuditLogRepository;
	private _userRepository: IUserRepository;

	constructor(
		userAuditLogRepository = new UserAuditLogRepository(),
		userRepository = new UserRepository(),
	) {
		this._userAuditLogRepository = userAuditLogRepository;
		this._userRepository = userRepository;
	}

	async execute(request: GetUserAuditLogsByUserIdDTO): Promise<IUserAuditLog[]> {
		const user = await this._userRepository.getUserById(request.userId);
		if (user === null) {    
			throw new NotFoundError(`User with ID ${request.userId} not found`);
		}

		const auditLogs = await this._userAuditLogRepository.getUserAuditLogsByUserId(user!.id);

		return auditLogs;
	}
}
