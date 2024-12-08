import type { Prisma, RoleAuditLog } from "@prisma/client";

export type IRoleAuditLogRawObject = RoleAuditLog;
export type IRoleAuditLogSchemaObject = Prisma.RoleAuditLogUncheckedCreateInput;
