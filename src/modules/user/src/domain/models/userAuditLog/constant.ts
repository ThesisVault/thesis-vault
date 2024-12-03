import type { Prisma, UserAuditLog } from "@prisma/client";

export type IUserAuditLogRawObject = UserAuditLog;
export type IUserAuditLogSchemaObject = Prisma.UserAuditLogCreateInput;
