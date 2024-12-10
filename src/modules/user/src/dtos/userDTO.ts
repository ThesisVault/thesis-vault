export interface UpdateUserPermissionDTO {
	userId: string;
	allowPermission: number;
	denyPermission: number;
	requestedById: string;
}

export interface UpdateUserRoleIdDTO {
	userId: string;
	roleId: string | null;
	requestedById: string;
}

export interface DeleteUserDTO {
	userId: string;
	requestedById: string;
}

export interface GetUsersByPaginationDTO {
	perPage: number;
	page: number;
	requestedById: string;
	includeDeleted?: boolean;
}

export interface HasPermissionByUserIdDTO {
	userId: string;
	permission: number;
	requestedById: string;
}
