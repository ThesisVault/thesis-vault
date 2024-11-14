import type { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import type { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import type { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";
import type { Role } from "@/modules/user/src/domain/models/user/shared/permission/roles";

export interface IUser {
	id: string;
	name: UserName;
	nameValue: string;
	email: string;
	image: string;
	role: UserRole;
	roleValue: Role;
	permissions: UserPermission;
	permissionsValue: number;
	createdAt: Date;
	updatedAt: Date;
}

export class User implements IUser {
	private readonly _id: string;
	private readonly _name: UserName;
	private readonly _email: string;
	private readonly _image: string;
	private readonly _role: UserRole;
	private readonly _permission: UserPermission;
	private readonly _createdAt: Date;
	private readonly _updatedAt: Date;

	private constructor({
		id,
		name,
		email,
		image,
		role,
		permissions,
		createdAt,
		updatedAt,
	}: {
		id: string;
		name: UserName;
		email: string;
		image: string;
		role: UserRole;
		permissions: UserPermission;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this._id = id;
		this._name = name;
		this._email = email;
		this._image = image;
		this._role = role;
		this._permission = permissions;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
	}

	get id(): string {
		return this._id;
	}

	get name(): UserName {
		return this._name;
	}

	get nameValue(): string {
		return this._name.value;
	}

	get email(): string {
		return this._email;
	}

	get image(): string {
		return this._image;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	get role(): UserRole {
		return this._role;
	}

	get roleValue(): Role {
		return this._role.value;
	}

	get permissions(): UserPermission {
		return this._permission;
	}

	get permissionsValue(): number {
		return this._permission.value;
	}

	public static create(props: {
		id: string;
		name: UserName;
		email: string;
		image: string;
		role: UserRole;
		permissions: UserPermission;
		createdAt: Date;
		updatedAt: Date;
	}): User {
		return new User(props);
	}
}
