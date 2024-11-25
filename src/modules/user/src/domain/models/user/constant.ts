import type { Prisma, User } from "@prisma/client";

export type IUserRawObject = User;
export type IUserSchemaObject = Prisma.UserUncheckedCreateInput;

export interface IUserJSONData {
	id: string;
	name: string;
	email: string;
	image: string;
	roleId: string | null;
	isSuperAdmin: boolean;
	allowPermissions: number;
	denyPermissions: number;
	isDeleted: boolean;
	deletedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}
