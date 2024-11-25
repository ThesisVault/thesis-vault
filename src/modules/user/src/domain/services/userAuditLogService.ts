import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IUserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import { UserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import type { QueryOptions } from "@/shared/constant";

export interface IUserAuditLogService {
	getUserAuditLogById(auditLogId: string, options?: QueryOptions): Promise<IUserAuditLog | null>;
	getUserAuditLogsByUserId(userId: string, options?: QueryOptions): Promise<IUserAuditLog[]>;
	createUserAuditLog(data: IUserAuditLog): Promise<IUserAuditLog | null>;
	createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]>;
}

export class UserAuditLogService implements IUserAuditLogService {
	private _userAuditLogRepository: IUserAuditLogRepository;

	constructor(userAuditLogRepository: IUserAuditLogRepository = new UserAuditLogRepository()) {
		this._userAuditLogRepository = userAuditLogRepository;
	}

	public async getUserAuditLogById(
		auditLogId: string,
		options?: QueryOptions,
	): Promise<IUserAuditLog | null> {
		return this._userAuditLogRepository.getUserAuditLogById(auditLogId, options);
	}

	public async getUserAuditLogsByUserId(
		userId: string,
		options?: QueryOptions,
	): Promise<IUserAuditLog[]> {
		return this._userAuditLogRepository.getUserAuditLogsByUserId(userId, options);
	}

	public async createUserAuditLog(data: IUserAuditLog): Promise<IUserAuditLog | null> {
		return this._userAuditLogRepository.createUserAuditLog(data);
	}

	public async createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]> {
		return this._userAuditLogRepository.createUserAuditLogs(auditLogs);
	}
}
