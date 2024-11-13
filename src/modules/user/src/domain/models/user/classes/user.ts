import type { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import type { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import type { UserRole } from "@/modules/user/src/domain/models/user/classes/userRole";

export interface IUser {
  id: string;
  name: UserName;
  email: string;
  image: string;
  role: UserRole;
  permissions: UserPermission;
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

  private constructor(props: IUser) {
    this._id = props.id;
    this._name = props.name; // Logic
    this._email = props.email;
    this._image = props.image;
    this._role = props.role; // Logic
    this._permission = props.permissions; // Logic
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }
  
  get id(): string {
    return this._id;
  }
  
  get name(): UserName {
    return this._name;
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
  
  get permissions(): UserPermission {
    return this._permission;
  }
  
  public static create(props: IUser): User {
    return new User(props);
  }
}
