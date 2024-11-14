import type { Roles } from "@/modules/user/src/domain/models/user/permission/constant";

export interface UpdateUserRoleDTO {
  editorId: string;
  userToEditId: string;
  newUserRole: Roles;
}
