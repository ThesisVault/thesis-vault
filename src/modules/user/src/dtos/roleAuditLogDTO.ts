export interface CreateAndSaveRoleAuditLogDTO {
	userId: string;
	roleId: string;
	type: string;
	description: string;
}

export interface GetRoleAuditLogsByPaginationDTO {
	perPage: number;
	page: number;
	requestedById: string;
}