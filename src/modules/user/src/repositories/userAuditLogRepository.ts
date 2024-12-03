import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import { db } from "@/shared/infrastructure/database";

export interface IUserAuditLogRepository {
	getUserAuditLogById(auditLogId: string): Promise<IUserAuditLog | null>;
	getUserAuditLogsByIds(auditLogIds: string[]): Promise<IUserAuditLog[]>;
	getUserAuditLogsByUserId(userId: string): Promise<IUserAuditLog[]>;
	createUserAuditLog(data: IUserAuditLog): Promise<void>;
	createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<void>;
}

export class UserAuditLogRepository implements IUserAuditLogRepository {
	private _auditLogDatabase;
	private _auditLogMapper;

	constructor(auditLogDatabase = db.userAuditLog, auditLogMapper = UserAuditLogMapper) {
		this._auditLogDatabase = auditLogDatabase;
		this._auditLogMapper = auditLogMapper;
	}

	async getUserAuditLogById(auditLogId: string): Promise<IUserAuditLog | null> {
		const auditLogs = await this.getUserAuditLogsByIds([auditLogId]);

		if (auditLogs.length === 0) {
			return null;
		}

		return auditLogs[0];
	}

	async getUserAuditLogsByIds(auditLogIds: string[]): Promise<IUserAuditLog[]> {
		const auditLogs = await this._auditLogDatabase.findMany({
			where: {
				id: {
					in: auditLogIds,
				},
			},
		});

		return auditLogs.map((auditLog) => this._auditLogMapper.toDomain(auditLog));
	}

	async getUserAuditLogsByUserId(userId: string): Promise<IUserAuditLog[]> {
		const auditLogsRaw = await this._auditLogDatabase.findMany({
			where: {
				userId: userId,
			},
		});

		return auditLogsRaw.map((auditLog) => this._auditLogMapper.toDomain(auditLog));
	}

	async createUserAuditLog(auditLog: IUserAuditLog): Promise<void> {
		await this.createUserAuditLogs([auditLog]);
	}

	async createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<void> {
		await this._auditLogDatabase.createMany({
			data: auditLogs.map((auditLog) => this._auditLogMapper.toPersistence(auditLog)),
		});
	}
}
