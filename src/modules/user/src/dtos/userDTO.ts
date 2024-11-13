import type { Roles } from "@/shared/lib/types";

export interface UpdateUserRoleDTO {
  editorId: string;
  userToEditId: string;
  newUserRole: Roles;
}
