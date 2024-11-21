export interface UpdateUserPermissionDTO {
  userId: string;
  allowPermission: number;
  denyPermission: number;
  requestedById: string;
}

export interface UpdateUserRoleIdDTO {
  userId: string
  roleId: string | null
  requestedById: string
}