
export interface UpdateUserPermissionDTO {
  userId: string;
  allowPermission: number;
  denyPermission: number;
  requestedById: string;
}
