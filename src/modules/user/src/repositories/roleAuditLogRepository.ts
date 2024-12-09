import type { IRoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import { RoleAuditLogMapper } from "@/modules/user/src/mappers/roleAuditLogMapper";
import type { Pagination, QueryOptions } from "@/shared/constant";
import { db } from "@/shared/infrastructure/database";

export interface IRoleAuditLogFilters {
	userId?: string;
	roleId?: string;
}

export interface IRoleAuditLogRepository {
	createRoleAuditLog(userAuditLog: IRoleAuditLog): Promise<IRoleAuditLog | null>;
	createRoleAuditLogs(userAuditLogs: IRoleAuditLog[]): Promise<IRoleAuditLog[]>;
	getRoleAuditLogById(auditLogId: string): Promise<IRoleAuditLog | null>;
	getRoleAuditLogsByIds(auditLogIds: string[]): Promise<IRoleAuditLog[]>;
	getRoleAuditLogByRoleId(roleId: string): Promise<IRoleAuditLog | null>;
	getRoleAuditLogsByRoleIds(roleIds: string[]): Promise<IRoleAuditLog[]>;
	getRoleAuditLogsByPagination(
		pagination: Pagination,
		filters?: IRoleAuditLogFilters,
	): Promise<IRoleAuditLog[]>;
	getRoleAuditLogsTotalPages(perPage: number, filter?: IRoleAuditLogFilters): Promise<number>;
}

export class RoleAuditLogRepository implements IRoleAuditLogRepository {
	private _roleAuditLogDatabase;
	private _roleAuditLogMapper;

	constructor(roleAuditLogDatabase = db.roleAuditLog, roleAuditLogMapper = RoleAuditLogMapper) {
		this._roleAuditLogDatabase = roleAuditLogDatabase;
		this._roleAuditLogMapper = roleAuditLogMapper;
	}

	async getRoleAuditLogById(roleAuditLogId: string): Promise<IRoleAuditLog | null> {
		const auditLogs = await this.getRoleAuditLogsByIds([roleAuditLogId]);
		if (auditLogs.length === 0) {
			return null;
		}

		return auditLogs[0];
	}

	async getRoleAuditLogsByIds(roleAuditLogIds: string[]): Promise<IRoleAuditLog[]> {
		const auditLogs = await this._roleAuditLogDatabase.findMany({
			where: {
				id: {
					in: roleAuditLogIds,
				},
			},
		});

		return auditLogs.map((auditLog) => this._roleAuditLogMapper.toDomain(auditLog));
	}

	async createRoleAuditLog(roleAuditLog: IRoleAuditLog): Promise<IRoleAuditLog | null> {
		const roleAuditLogDomains = await this.createRoleAuditLogs([roleAuditLog]);
		if (roleAuditLogDomains.length === 0) {
			return null;
		}

		return roleAuditLogDomains[0];
	}

	async createRoleAuditLogs(roleAuditLogs: IRoleAuditLog[]): Promise<IRoleAuditLog[]> {
		try {
			const roleAuditLogsPersistence = await db.$transaction(
				roleAuditLogs.map((roleAuditLog) => {
					return this._roleAuditLogDatabase.create({
						data: RoleAuditLogMapper.toPersistence(roleAuditLog),
					});
				}),
			);

			return roleAuditLogsPersistence.map((roleAuditLog) =>
				RoleAuditLogMapper.toDomain(roleAuditLog),
			);
		} catch {
			return [];
		}
	}

	async getRoleAuditLogByRoleId(roleAuditLogId: string): Promise<IRoleAuditLog | null> {
		const roleAuditLogs = await this.getRoleAuditLogsByRoleIds([roleAuditLogId]);
		if (roleAuditLogs.length === 0) {
			return null;
		}

		return roleAuditLogs[0];
	}

	async getRoleAuditLogsByRoleIds(roleIds: string[]): Promise<IRoleAuditLog[]> {
		const roleAuditLogs = await this._roleAuditLogDatabase.findMany({
			where: {
				roleId: {
					in: roleIds,
				},
			},
		});

		return roleAuditLogs.map((roleAuditLog) => this._roleAuditLogMapper.toDomain(roleAuditLog));
	}

	async getRoleAuditLogsByPagination(
		pagination: Pagination,
		filters?: IRoleAuditLogFilters,
	): Promise<IRoleAuditLog[]> {
		const roleAuditLogsRaw = await this._roleAuditLogDatabase.findMany({
			skip: pagination.skip,
			take: pagination.size,
			where: this._filterQuery(filters),
			orderBy: [{ createdAt: "asc" }],
		});

		return roleAuditLogsRaw.map((roleAuditLog) => this._roleAuditLogMapper.toDomain(roleAuditLog));
	}

	async getRoleAuditLogsTotalPages(
		perPage: number,
		filter?: IRoleAuditLogFilters,
	): Promise<number> {
		const totalCount = await this._roleAuditLogDatabase.count({
			where: this._filterQuery(filter),
		});
		return Math.ceil(totalCount / perPage);
	}

	private _filterQuery(filters?: IRoleAuditLogFilters) {
		if (!filters || (!filters.userId && !filters.roleId)) {
			return {};
		}

		if (filters.roleId && !filters.userId) {
			return { roleId: filters.roleId };
		}

		if (!filters.roleId && filters.userId) {
			return { userId: filters.userId };
		}

		return {
			AND: [{ userId: { equals: filters.userId } }, { roleId: { equals: filters.roleId } }],
		};
	}
}
