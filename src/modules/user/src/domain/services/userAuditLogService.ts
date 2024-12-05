import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";
import type { CreateAndSaveUserAuditLogDTO } from "@/modules/user/src/dtos/userAuditLogDTO";
import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "@/modules/user/src/repositories/userAuditLogRepository";
import { UnexpectedError } from "@/shared/core/errors";
import { v4 as uuid } from "uuid";

export interface IUserAuditLogService {
	createAndSaveUserAuditLog(params: CreateAndSaveUserAuditLogDTO): Promise<void>;
}

export class UserAuditLogService implements IUserAuditLogService {
	private _userAuditLogRepository: IUserAuditLogRepository;

	constructor(userAuditLogRepository = new UserAuditLogRepository()) {
		this._userAuditLogRepository = userAuditLogRepository;
	}

	public async createAndSaveUserAuditLog(params: CreateAndSaveUserAuditLogDTO): Promise<void> {
		const auditLogOrError = UserAuditLogFactory.create({
			id: uuid(),
			userId: params.userId,
			type: params.type,
			createdAt: new Date(),
			description: params.description,
		});
		if (auditLogOrError.isFailure) {
			throw new UnexpectedError("Unexpected error occurred while creating auditLog");
		}

		await this._userAuditLogRepository.createUserAuditLog(auditLogOrError.getValue());
	}
}
