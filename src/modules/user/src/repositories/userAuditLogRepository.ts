import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import type { QueryOptions } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

export interface IUserAuditLogRepository {
	getUserAuditLogById(auditLogId: string, options?: QueryOptions): Promise<IUserAuditLog | null>;
	getUserAuditLogsByUserId(userId: string, options?: QueryOptions): Promise<IUserAuditLog[]>;
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

	async getUserAuditLogById(
		auditLogId: string,
		options?: QueryOptions,
	): Promise<IUserAuditLog | null> {
		const auditLog = await db.userAuditLog.findUnique({
			where: {
				id: auditLogId,
			},
		});
		return auditLog;
	}

	async getUserAuditLogsByUserId(userId: string, options?: QueryOptions): Promise<IUserAuditLog[]> {
		const auditLogsRaw = await this._auditLogDatabase.findMany({
			where: {
				userId: userId,
			},
		});

		return auditLogsRaw.map((auditLog) => this._auditLogMapper.toDomain(auditLog));
	}

	async createUserAuditLog(data: IUserAuditLog): Promise<IUserAuditLog | null> {
		try {
			const userExists = await db.user.findUnique({
				where: { id: data.userId },
			});

			const userAuditLogInstance = UserAuditLog.create({
				id: data.id,
				userId: data.userId,
				type: data.type,
				description: data.description,
				createdAt: data.createdAt,
			});

			const createdAuditLog = await this.createUserAuditLogs([userAuditLogInstance]);

			return createdAuditLog.length > 0 ? createdAuditLog[0] : null;
		} catch (error) {
			console.error("Error creating user audit log:", error);
			return null;
		}
	}

	async createUserAuditLogs(auditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]> {
		const userAuditLogs = auditLogs.map((auditLog) =>
			UserAuditLog.create({
				id: auditLog.id,
				userId: auditLog.userId,
				type: auditLog.type,
				description: auditLog.description,
				createdAt: auditLog.createdAt,
			}),
		);

		try {
			for (const auditLog of userAuditLogs) {
				const userExists = await db.user.findUnique({
					where: { id: auditLog.userId },
				});

				if (!userExists) {
					return [];
				}
			}

			const createdAuditLogsPersistence = await db.$transaction(
				userAuditLogs.map((auditLog) => {
					return this._auditLogDatabase.create({
						data: UserAuditLogMapper.toPersistence(auditLog),
					});
				}),
			);

			return createdAuditLogsPersistence.map((auditLog) => UserAuditLogMapper.toDomain(auditLog));
		} catch (error) {
			console.error("Error creating user audit logs:", error);
			return [];
		}
	}
}
