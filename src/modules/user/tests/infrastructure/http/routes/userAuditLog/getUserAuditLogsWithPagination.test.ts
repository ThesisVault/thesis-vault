import { userAuditLogRouter } from "@/modules/user/src/infrastructure/http/routes/userAuditLogRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import type { TRPCError } from "@trpc/server";

describe("getUserAuditLogsWithPaginationEndPoint", () => {
	describe("User is authenticated", () => {
		beforeEach(async () => {
			await db.userAuditLog.deleteMany();
		});

		it("should return user audit logs, limited by pagination size", async () => {
			const seededLog1 = await seedUserAuditLog({});
			const seededLog2 = await seedUserAuditLog({});
			const seededLog3 = await seedUserAuditLog({});

			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.VIEW_USER_AUDIT_LOG,
			});

			const request = {
				perPage: 2,
				page: 1,
			};

			const createdCaller = createCallerFactory(userAuditLogRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUserWithPermission.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const result = await caller.getUserAuditLogsWithPagination(request);

			expect(result.logs.length).toBe(2);
			expect(result.page).toBe(1);
			expect(result.hasPreviousPage).toBe(false);
			expect(result.hasNextPage).toBe(true);
			expect(result.totalPages).toBe(2);

			const logIds = result.logs.map((log) => log.id);
			expect(logIds).toEqual([seededLog1.id, seededLog2.id]);
			expect(logIds).not.toContain(seededLog3.id);
		});

		it("should return an error if user does not have VIEW_USER_AUDIT_LOG permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: 0,
			});

			const request = {
				page: 1,
				perPage: 2,
				requestedById: seededUser.id,
			};

			const createdCaller = createCallerFactory(userAuditLogRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUser.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getUserAuditLogsWithPagination(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(
				`User ${seededUser.id} does not have VIEW_USER_AUDIT_LOG permission`,
			);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const request = {
				page: 1,
				perPage: 10,
			};

			const createdCaller = createCallerFactory(userAuditLogRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getUserAuditLogsWithPagination(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
