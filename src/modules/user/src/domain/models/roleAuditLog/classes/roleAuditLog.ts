import type { RoleAuditLogType } from "./roleAuditLogType";

export interface IRoleAuditLog {
	id: string;
	userId: string;
	type: RoleAuditLogType;
	typeValue: string;
	description: string;
	createdAt: Date;
	roleId: string;
}

export class RoleAuditLog implements IRoleAuditLog {
	private readonly _id: string;
	private readonly _userId: string;
	private readonly _type: RoleAuditLogType;
	private readonly _description: string;
	private readonly _createdAt: Date;
	private readonly _roleId: string;

	private constructor({
		id,
		userId,
		type,
		description,
		createdAt,
		roleId,
	}: {
		id: string;
		userId: string;
		type: RoleAuditLogType;
		description: string;
		createdAt: Date;
		roleId: string;
	}) {
		this._id = id;
		this._userId = userId;
		this._type = type;
		this._description = description;
		this._createdAt = createdAt;
		this._roleId = roleId;
	}

	get id(): string {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get type(): RoleAuditLogType {
		return this._type;
	}

	get typeValue(): string {
		return this._type.value;
	}

	get description(): string {
		return this._description;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get roleId(): string {
		return this._roleId;
	}

	public static create(props: {
		id: string;
		userId: string;
		type: RoleAuditLogType;
		description: string;
		createdAt: Date;
		roleId: string;
	}): RoleAuditLog {
		return new RoleAuditLog(props);
	}
}
