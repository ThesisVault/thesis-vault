export interface CreateAndSaveUserAuditLogDTO {
	userId: string;
	type: string;
	description: string;
}

export interface GetUserAuditLogsByUserIdDTO {
	userId: string;
	requestedById: string;
}

export interface GetUserAuditLogsWithPaginationDTO {
	perPage: number;
	page: number;
	requestedById: string;
}
