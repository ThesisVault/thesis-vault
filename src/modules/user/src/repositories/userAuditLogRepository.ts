import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import { db } from "@/shared/infrastructure/database";

export interface IUserAuditLogRepository {
	getUserAuditLogById(auditLogId: string): Promise<IUserAuditLog | null>;
	getUserAuditLogsByUserId(userId: string): Promise<IUserAuditLog[]>;
	createUserAuditLog(data: IUserAuditLog): Promise<IUserAuditLog | null>;
	createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]>;
}

export class UserAuditLogRepository implements IUserAuditLogRepository {
	private _auditLogDatabase;
	private _auditLogMapper;

	constructor(auditLogDatabase = db.userAuditLog, auditLogMapper = UserAuditLogMapper) {
		this._auditLogDatabase = auditLogDatabase;
		this._auditLogMapper = auditLogMapper;
	}

	async getUserAuditLogById(auditLogId: string): Promise<IUserAuditLog | null> {
		const auditLog = await this._auditLogDatabase.findUnique({
			where: {
				id: auditLogId,
			},
		});

		if (!auditLog) {
			return null;
		}

		return this._auditLogMapper.toDomain(auditLog);
	}

	async getUserAuditLogsByUserId(userId: string): Promise<IUserAuditLog[]> {
		const auditLogsRaw = await this._auditLogDatabase.findMany({
			where: {
				userId: userId,
			},
		});

		return auditLogsRaw.map((auditLog) => this._auditLogMapper.toDomain(auditLog));
	}

	async createUserAuditLog(auditLog: IUserAuditLog): Promise<IUserAuditLog | null> {
		if (!auditLog.userId || auditLog.userId.trim() === "") {
			throw new Error("User ID cannot be empty");
		}

		try {
			const createdAuditLog = await this._auditLogDatabase.create({
				data: {
					id: auditLog.id,
					userId: auditLog.userId,
					type: auditLog.type.value,
					description: auditLog.description.value,
					createdAt: auditLog.createdAt,
				},
			});

			return this._auditLogMapper.toDomain(createdAuditLog);
		} catch (error) {
			return null;
		}
	}

	async createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]> {
		try {
			const mappedAuditLogs = auditLogs.map((auditLog) => ({
				id: auditLog.id,
				userId: auditLog.userId,
				type: auditLog.type.value,
				description: auditLog.description.value,
				createdAt: auditLog.createdAt,
			}));

			await this._auditLogDatabase.createMany({
				data: mappedAuditLogs,
			});

			const createdAuditLogs = await this._auditLogDatabase.findMany({
				where: {
					id: { in: auditLogs.map((log) => log.id) },
				},
			});

			return createdAuditLogs.map((auditLog) => UserAuditLogMapper.toDomain(auditLog));
		} catch (error) {
			return [];
		}
	}
}
