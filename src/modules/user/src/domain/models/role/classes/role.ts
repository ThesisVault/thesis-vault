import type { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import type { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";

export interface IRole {
	id: string;
	name: RoleName;
	nameValue: string;
	permissions: RolePermission;
	color: string;
	permissionsValue: number;
	isDeleted: boolean;
	deletedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	softDelete: () => void;
	updateRole: (name: RoleName, permission: RolePermission, color: string) => void;
}

export class Role implements IRole {
	private readonly _id: string;
	private _name: RoleName;
	private _permissions: RolePermission;
	private _color: string;
	private _isDeleted: boolean;
	private _deletedAt: Date | null;
	private readonly _createdAt: Date;
	private readonly _updatedAt: Date;

	private constructor({
		id,
		name,
		permissions,
		color,
		isDeleted,
		deletedAt,
		createdAt,
		updatedAt,
	}: {
		id: string;
		name: RoleName;
		permissions: RolePermission;
		color: string;
		isDeleted: boolean;
		deletedAt: Date | null;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this._id = id;
		this._name = name;
		this._permissions = permissions;
		this._color = color;
		this._isDeleted = isDeleted;
		this._deletedAt = deletedAt;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
	}

	get id(): string {
		return this._id;
	}

	get name(): RoleName {
		return this._name;
	}

	get nameValue(): string {
		return this._name.value;
	}

	get permissions(): RolePermission {
		return this._permissions;
	}

	get permissionsValue(): number {
		return this._permissions.value;
	}

	get color(): string {
		return this._color;
	}

	get isDeleted(): boolean {
		return this._isDeleted;
	}

	get deletedAt(): Date | null {
		return this._deletedAt;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	public softDelete(): void {
		this._isDeleted = true;
		this._deletedAt = new Date();
	}

	public updateRole(name: RoleName, permission: RolePermission, color: string): void {
		this._name = name;
		this._permissions = permission;
		this._color = color;
	}

	public static create(props: {
		id: string;
		name: RoleName;
		permissions: RolePermission;
		color: string;
		isDeleted: boolean;
		deletedAt: Date | null;
		createdAt: Date;
		updatedAt: Date;
	}): Role {
		return new Role(props);
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.nameValue,
			permissions: this.permissionsValue,
			color: this.color,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
