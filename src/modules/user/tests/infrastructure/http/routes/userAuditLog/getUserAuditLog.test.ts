import { userAuditLogRouter } from "@/modules/user/src/infrastructure/http/routes/userAuditLogRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("getUserAuditLogsByUserId", () => {
	describe("Authenticated User", () => {
		it("should return user audit logs when the user has the permission and user exists", async () => {
			const seededUser = await seedUser({});
			const seededAuthenticatedUser = await seedUser({
				allowPermissions: Permissions.VIEW_USER_AUDIT_LOG,
			});

			const seededUserAuditLog1 = await seedUserAuditLog({ userId: seededUser.id });
			const seededUserAuditLog2 = await seedUserAuditLog({ userId: seededUser.id });

			const request = {
				userId: seededUser.id,
			};

			const createdCaller = createCallerFactory(userAuditLogRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededAuthenticatedUser.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const auditLogs = await caller.getUserAuditLogsByUserId(request);
			const auditLogsIds = auditLogs.map((auditLog) => auditLog.id);

			expect(auditLogsIds).toEqual([seededUserAuditLog1.id, seededUserAuditLog2.id]);
			expect(auditLogs).toHaveLength(2);
		});
	});

	describe("Unauthenticated User", () => {
		it("should return an unauthorized error if the user is not authenticated", async () => {
			const request = {
				userId: faker.string.uuid(),
			};

			const createdCaller = createCallerFactory(userAuditLogRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getUserAuditLogsByUserId(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
