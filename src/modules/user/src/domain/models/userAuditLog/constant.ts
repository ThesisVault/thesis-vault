import type { Prisma, UserAuditLog } from "@prisma/client";

export type IAuditLogRawObject = UserAuditLog;
export type IAuditLogSchemaObject = Prisma.UserAuditLogCreateInput;
