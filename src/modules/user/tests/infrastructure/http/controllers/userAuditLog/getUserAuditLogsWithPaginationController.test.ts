import { GetUserAuditLogsWithPaginationController } from "@/modules/user/src/infrastructure/http/controllers/userAuditLog/getUserAuditLogsWithPaginationController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";
import { db } from "@/shared/infrastructure/database";

describe("GetUserAuditLogsWithPaginationController", () => {
	let getUserAuditLogsWithPaginationController: GetUserAuditLogsWithPaginationController;

	beforeAll(() => {
		getUserAuditLogsWithPaginationController = new GetUserAuditLogsWithPaginationController();
	});

	beforeEach(async () => {
		await db.userAuditLog.deleteMany();
		await db.user.deleteMany();
	});

	it("should return logs, limited by pagination size", async () => {
		const seededLog1 = await seedUserAuditLog({});
		const seededLog2 = await seedUserAuditLog({});
		const seededLog3 = await seedUserAuditLog({});

		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.VIEW_USER_AUDIT_LOG,
		});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};

		const response = await getUserAuditLogsWithPaginationController.executeImpl(request);

		expect(response.logs.length).toBe(2);
		expect(response.page).toBe(1);
		expect(response.hasPreviousPage).toBe(false);
		expect(response.hasNextPage).toBe(true);
		expect(response.totalPages).toBe(2);

		const userIds = response.logs.map((log) => log.id);
		expect(userIds).toEqual([seededLog1.id, seededLog2.id]);
		expect(userIds).not.toContain(seededLog3.id);
	});

	it("should throw a ForbiddenError when the user who requested does not have the required permission", async () => {
		const seededUserRequestedBy = await seedUser({
			allowPermissions: 0,
			denyPermissions: Permissions.VIEW_USER_AUDIT_LOG,
		});

		const request = {
			perPage: 2,
			page: 1,
			requestedById: seededUserRequestedBy.id,
		};

		let errorMessage = "";
		try {
			await getUserAuditLogsWithPaginationController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have VIEW_USER_AUDIT_LOG permission`,
		);
	});
});
