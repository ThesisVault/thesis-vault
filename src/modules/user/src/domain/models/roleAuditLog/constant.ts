import type { Prisma, RoleAuditLog } from "@prisma/client";

export type IRoleAuditLogRawObject = RoleAuditLog;
export type IRoleAuditLogSchemaObject = Prisma.RoleAuditLogUncheckedCreateInput;

export const RoleAuditLogTypes = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE"
}
export type IRoleAuditLogType = typeof RoleAuditLogTypes[keyof typeof RoleAuditLogTypes];
