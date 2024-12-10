import { roleAuditLogRouter } from "@/modules/user/src/infrastructure/http/routes/roleAuditLogRouter";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { ForbiddenError } from "@/shared/core/errors";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import type { TRPCError } from "@trpc/server";

describe("getRoleAuditLogsByPaginationEndPoint", () => {
	describe("User is authenticated", () => {
		beforeEach(async () => {
			await db.roleAuditLog.deleteMany();
		});

		it("should return role audit logs, limited by pagination size", async () => {
			const seededLog1 = await seedRoleAuditLog({});
			const seededLog2 = await seedRoleAuditLog({});
			const seededLog3 = await seedRoleAuditLog({});

			const seededUserWithPermission = await seedUser({
				allowPermissions: Permissions.MANAGE_ROLE,
			});

			const request = {
				perPage: 2,
				page: 1,
			};

			const createdCaller = createCallerFactory(roleAuditLogRouter);
			const caller = createdCaller({
				session: {
					user: {
						id: seededUserWithPermission.id,
					},
					expires: new Date().toString(),
				},
				db: db,
			});

			const result = await caller.getRoleAuditLogsByPagination(request);

			expect(result.auditLogs.length).toBe(2);
			expect(result.page).toBe(1);
			expect(result.hasPreviousPage).toBe(false);
			expect(result.hasNextPage).toBe(true);
			expect(result.totalPages).toBe(2);

			const logIds = result.auditLogs.map((log) => log.id);
			expect(logIds).toEqual([seededLog1.id, seededLog2.id]);
			expect(logIds).not.toContain(seededLog3.id);
		});

		it("should return an error if user does not have MANAGE_ROLE permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: 0,
			});

			const request = {
				perPage: 2,
				page: 1,
				requestedById: seededUser.id,
			};

			const createdCaller = createCallerFactory(roleAuditLogRouter);
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
				await caller.getRoleAuditLogsByPagination(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(ForbiddenError);
			}

			expect(errorMessage).toBe(
				`User ${seededUser.id} does not have MANAGE_ROLE permission`,
			);
		});
	});

	describe("User is unauthenticated", () => {
		it("should return an unauthorized error if user is not authenticated", async () => {
			const request = {
				page: 1,
				perPage: 10,
			};

			const createdCaller = createCallerFactory(roleAuditLogRouter);
			const caller = createdCaller({
				session: null,
				db: db,
			});

			let errorMessage = "";
			try {
				await caller.getRoleAuditLogsByPagination(request);
			} catch (error) {
				errorMessage = (error as TRPCError).message;
			}

			expect(errorMessage).toBe("UNAUTHORIZED");
		});
	});
});
