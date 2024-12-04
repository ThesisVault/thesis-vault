import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";
import {
	type IUserAuditLogRepository,
	UserAuditLogRepository,
} from "@/modules/user/src/repositories/userAuditLogRepository";
import { UnexpectedError } from "@/shared/core/errors";
import { v4 as uuid } from "uuid";

interface ICreateUserAuditLogParams {
	userId: string;
	type: string;
	description: string;
}

export interface IUserAuditLogService {
	addUserAuditRecord(params: ICreateUserAuditLogParams): Promise<void>;
}

export class UserAuditLogService implements IUserAuditLogService {
	private _userAuditLogRepository: IUserAuditLogRepository;

	constructor(userAuditLogRepository = new UserAuditLogRepository()) {
		this._userAuditLogRepository = userAuditLogRepository;
	}

	public async addUserAuditRecord(params: ICreateUserAuditLogParams): Promise<void> {
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
