import type { UserAuditLogType } from "./userAuditLogType";

export interface IUserAuditLog {
	id: string;
	userId: string;
	type: UserAuditLogType;
	typeValue: string;
	description: string;
	createdAt: Date;
}

export class UserAuditLog implements IUserAuditLog {
	private readonly _id: string;
	private readonly _userId: string;
	private readonly _type: UserAuditLogType;
	private readonly _description: string;
	private readonly _createdAt: Date;

	private constructor({
		id,
		userId,
		type,
		description,
		createdAt,
	}: {
		id: string;
		userId: string;
		type: UserAuditLogType;
		description: string;
		createdAt: Date;
	}) {
		this._id = id;
		this._userId = userId;
		this._type = type;
		this._description = description;
		this._createdAt = createdAt;
	}

	get id(): string {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get type(): UserAuditLogType {
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

	public static create(props: {
		id: string;
		userId: string;
		type: UserAuditLogType;
		description: string;
		createdAt: Date;
	}): UserAuditLog {
		return new UserAuditLog(props);
	}
}
