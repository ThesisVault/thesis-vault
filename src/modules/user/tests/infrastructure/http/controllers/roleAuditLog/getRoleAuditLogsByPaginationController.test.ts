import { GetRoleAuditLogsByPaginationController } from "@/modules/user/src/infrastructure/http/controllers/roleAuditLog/getRoleAuditLogsByPaginationController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("GetRoleAuditLogsByPaginationController", () => {
	let getRoleAuditLogsByPaginationController: GetRoleAuditLogsByPaginationController;

	beforeAll(() => {
		getRoleAuditLogsByPaginationController = new GetRoleAuditLogsByPaginationController();
	});

	beforeEach(async () => {
		await db.roleAuditLog.deleteMany();
	});

	it("should return role audit logs, limited by pagination size", async () => {
		const seededLog1 = await seedRoleAuditLog({});
		const seededLog2 = await seedRoleAuditLog({});
		const seededLog3 = await seedRoleAuditLog({});

		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_ROLE,
		});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};

		const response = await getRoleAuditLogsByPaginationController.executeImpl(request);

		expect(response.auditLogs.length).toBe(2);
		expect(response.page).toBe(1);
		expect(response.hasPreviousPage).toBe(false);
		expect(response.hasNextPage).toBe(true);
		expect(response.totalPages).toBe(2);

		const logIds = response.auditLogs.map((log) => log.id);
		expect(logIds).toEqual([seededLog1.id, seededLog2.id]);
		expect(logIds).not.toContain(seededLog3.id);
	});

	it("should throw a ForbiddenError when the user who requested does not have MANAGE_ROLE permission", async () => {
		const seededUserRequestedBy = await seedUser({
			allowPermissions: 0,
			denyPermissions: Permissions.MANAGE_ROLE,
		});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};

		let errorMessage = "";
		try {
			await getRoleAuditLogsByPaginationController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_ROLE permission`,
		);
	});
});
