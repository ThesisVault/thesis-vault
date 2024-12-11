export interface GetRolesDTO {
	requestedById: string;
}

export interface UpdateRoleDTO {
	roleId: string;
	name: string;
	permissions: number;
	color: string;
	requestedById: string;
}

export interface DeleteRoleDTO {
	roleId: string;
	requestedById: string;
}

export interface GetRoleByIdDTO {
	roleId: string;
	requestedById: string;
}

export interface CreateRoleDTO {
	name: string;
	permissions: number;
	color: string;
	requestedById: string;
}
