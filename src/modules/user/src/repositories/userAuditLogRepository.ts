import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import type { Pagination } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

export interface IUserAuditLogRepository {
	getUserAuditLogById(auditLogId: string): Promise<IUserAuditLog | null>;
	getUserAuditLogsByIds(auditLogIds: string[]): Promise<IUserAuditLog[]>;
	getUserAuditLogsByUserId(userId: string): Promise<IUserAuditLog[]>;
	createUserAuditLog(userAuditLog: IUserAuditLog): Promise<IUserAuditLog | null>;
	createUserAuditLogs(userAuditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]>;
	getUserAuditLogsWithPagination(pagination: Pagination): Promise<IUserAuditLog[]>;
	getUserAuditLogTotalPage(perPage: number): Promise<number>;
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

	async createUserAuditLog(userAuditLog: IUserAuditLog): Promise<IUserAuditLog | null> {
		const userAuditLogDomain = await this.createUserAuditLogs([userAuditLog]);

		if (userAuditLogDomain.length === 0) {
			return null;
		}

		return userAuditLogDomain[0];
	}

	async createUserAuditLogs(userAuditLogs: IUserAuditLog[]): Promise<IUserAuditLog[]> {
		try {
			const userAuditLogPersistence = await db.$transaction(
				userAuditLogs.map((userAuditLog) => {
					return this._auditLogDatabase.create({
						data: UserAuditLogMapper.toPersistence(userAuditLog),
					});
				}),
			);

			return userAuditLogPersistence.map((userAuditLog) =>
				UserAuditLogMapper.toDomain(userAuditLog),
			);
		} catch {
			return [];
		}
	}

	async getUserAuditLogsWithPagination(pagination: Pagination): Promise<IUserAuditLog[]> {
		const userAuditLogRaw = await this._auditLogDatabase.findMany({
			skip: pagination.skip,
			take: pagination.size,
			orderBy: [{ createdAt: "asc" }],
		});

		return userAuditLogRaw.map((userAuditLog) => this._auditLogMapper.toDomain(userAuditLog));
	}

	async getUserAuditLogTotalPage(perPage: number): Promise<number> {
		const totalCount = await this._auditLogDatabase.count({});

		return Math.ceil(totalCount / perPage);
	}
}
