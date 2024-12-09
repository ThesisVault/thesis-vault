import type { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import type { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import type { IUserJSONData } from "@/modules/user/src/domain/models/user/constant";

export interface IUser {
	id: string;
	name: UserName;
	nameValue: string;
	email: string;
	image: string;
	roleId: string | null;
	isSuperAdmin: boolean;
	allowPermissions: UserPermission;
	allowPermissionsValue: number;
	denyPermissions: UserPermission;
	denyPermissionsValue: number;
	isDeleted: boolean;
	deletedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	updatePermission: (allowPermissions: UserPermission, denyPermissions: UserPermission) => void;
	updateRoleId: (roleId: string | null) => void;
	softDelete: () => void;
	toJSON: () => IUserJSONData;
}

export class User implements IUser {
	private readonly _id: string;
	private readonly _name: UserName;
	private readonly _email: string;
	private readonly _image: string;
	private _roleId: string | null;
	private readonly _isSuperAdmin: boolean;
	private _allowPermissions: UserPermission;
	private _denyPermissions: UserPermission;
	private _isDeleted: boolean;
	private _deletedAt: Date | null;
	private readonly _createdAt: Date;
	private _updatedAt: Date;

	constructor({
		id,
		name,
		email,
		image,
		roleId,
		isSuperAdmin,
		allowPermissions,
		denyPermissions,
		isDeleted,
		deletedAt,
		createdAt,
		updatedAt,
	}: {
		id: string;
		name: UserName;
		email: string;
		image: string;
		roleId: string | null;
		isSuperAdmin: boolean;
		allowPermissions: UserPermission;
		denyPermissions: UserPermission;
		isDeleted: boolean;
		deletedAt: Date | null;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this._id = id;
		this._name = name;
		this._email = email;
		this._image = image;
		this._roleId = roleId;
		this._isSuperAdmin = isSuperAdmin;
		this._allowPermissions = allowPermissions;
		this._denyPermissions = denyPermissions;
		this._isDeleted = isDeleted;
		this._deletedAt = deletedAt;
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

	get roleId(): string | null {
		return this._roleId;
	}

	get isSuperAdmin(): boolean {
		return this._isSuperAdmin;
	}

	get allowPermissions(): UserPermission {
		return this._allowPermissions;
	}

	get allowPermissionsValue(): number {
		return this._allowPermissions.value;
	}

	get denyPermissions(): UserPermission {
		return this._denyPermissions;
	}

	get denyPermissionsValue(): number {
		return this._denyPermissions.value;
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

	public updatePermission(allowPermissions: UserPermission, denyPermissions: UserPermission): void {
		this._allowPermissions = allowPermissions;
		this._denyPermissions = denyPermissions;
	}

	public updateRoleId(roleId: string | null): void {
		this._roleId = roleId;
	}

	public softDelete(): void {
		this._isDeleted = true;
		this._deletedAt = new Date();
	}

	public static create(props: {
		id: string;
		name: UserName;
		email: string;
		image: string;
		roleId: string | null;
		isSuperAdmin: boolean;
		allowPermissions: UserPermission;
		denyPermissions: UserPermission;
		isDeleted: boolean;
		deletedAt: Date | null;
		createdAt: Date;
		updatedAt: Date;
	}): User {
		return new User(props);
	}

	public toJSON(): IUserJSONData {
		return {
			id: this.id,
			name: this.nameValue,
			email: this.email,
			image: this.image,
			roleId: this.roleId,
			isSuperAdmin: this.isSuperAdmin,
			allowPermissions: this.allowPermissionsValue,
			denyPermissions: this.denyPermissionsValue,
			isDeleted: this.isDeleted,
			deletedAt: this.deletedAt,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
