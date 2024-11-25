import type { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import type { RolePermission } from "@/modules/user/src/domain/models/role/classes/rolePermission";

export interface IRole {
	id: string;
	name: RoleName;
	nameValue: string;
	permissions: RolePermission;
	color: string;
	permissionsValue: number;
	createdAt: Date;
	updatedAt: Date;
}

export class Role implements IRole {
	private readonly _id: string;
	private readonly _name: RoleName;
	private readonly _permissions: RolePermission;
	private readonly _color: string;
	private readonly _createdAt: Date;
	private readonly _updatedAt: Date;

	private constructor({
		id,
		name,
		permissions,
		color,
		createdAt,
		updatedAt,
	}: {
		id: string;
		name: RoleName;
		permissions: RolePermission;
		color: string,
		createdAt: Date;
		updatedAt: Date;
	}) {
		this._id = id;
		this._name = name;
		this._permissions = permissions;
		this._color = color;
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


	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	public static create(props: {
		id: string;
		name: RoleName;
		permissions: RolePermission;
		color: string;
		createdAt: Date;
		updatedAt: Date;
	}): Role {
		return new Role(props);
	}
}
