
export interface UpdateUserPermissionDTO {
  userToEditId: string;
  permissions: number;
  editorId: string;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  permissions: number;
  role: string;
  image?: string;
}
