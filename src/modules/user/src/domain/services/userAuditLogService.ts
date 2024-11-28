import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IUserAuditLogRepository } from "@/modules/user/src/repositories/userAuditLogRepository";
import type { QueryOptions } from "@/shared/constant";

export interface IUserAuditLogService {
	getUserAuditLogById(auditLogId: string, options?: QueryOptions): Promise<IUserAuditLog | null>;
	getUserAuditLogsByUserId(userId: string, options?: QueryOptions): Promise<IUserAuditLog[]>;
	createUserAuditLog(data: IUserAuditLog): Promise<IUserAuditLog | null>;
	createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]>;
}

export class UserAuditLogService implements IUserAuditLogService {
	private _userAuditLogRepository: IUserAuditLogRepository;

	constructor(userAuditLogRepository: IUserAuditLogRepository) {
		this._userAuditLogRepository = userAuditLogRepository;
	}

	public async getUserAuditLogById(auditLogId: string): Promise<IUserAuditLog | null> {
		return this._userAuditLogRepository.getUserAuditLogById(auditLogId);
	}

	public async getUserAuditLogsByUserId(userId: string): Promise<IUserAuditLog[]> {
		return this._userAuditLogRepository.getUserAuditLogsByUserId(userId);
	}

	public async createUserAuditLog(auditLog: IUserAuditLog): Promise<IUserAuditLog | null> {
		return this._userAuditLogRepository.createUserAuditLog(auditLog);
	}

	public async createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]> {
		return this._userAuditLogRepository.createUserAuditLogs(auditLogs);
	}
}
