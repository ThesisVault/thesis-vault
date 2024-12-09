import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IUserAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import type { GetUserAuditLogsByUserIdDTO } from "@/modules/user/src/dtos/userAuditLogDTO";
import { GetUserAuditLogsByUserIdController } from "@/modules/user/src/infrastructure/http/controllers/userAuditLog/getUserAuditLogsByUserIdController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { seedUserAuditLog } from "@/modules/user/tests/utils/userAuditLog/seedUserAuditLog";

const assertAuditLog = (auditLog: IUserAuditLog, expectedLog: IUserAuditLogRawObject) => {
	expect(auditLog.id).toBe(expectedLog.id);
	expect(auditLog.userId).toBe(expectedLog.userId);
	expect(auditLog.type.value).toBe(expectedLog.type);
	expect(auditLog.description).toBe(expectedLog.description);
	expect(auditLog.createdAt.toISOString()).toBe(expectedLog.createdAt.toISOString());
};
describe("GetUserAuditLogsByUserIdController", () => {
	let getUserAuditLogsByUserIdController: GetUserAuditLogsByUserIdController;

	beforeAll(() => {
		getUserAuditLogsByUserIdController = new GetUserAuditLogsByUserIdController();
	});

	it("should return user audit logs when the user who requested has permission and exists", async () => {
		const seededUser = await seedUser({});
		const seeededUserAuditLog1 = await seedUserAuditLog({ userId: seededUser.id });
		const seeededUserAuditLog2 = await seedUserAuditLog({ userId: seededUser.id });
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.VIEW_USER_AUDIT_LOG,
		});

		const request: GetUserAuditLogsByUserIdDTO = {
			userId: seededUser.id,
			requestedById: seededUserRequestedBy.id,
		};

		const auditLogs = await getUserAuditLogsByUserIdController.executeImpl(request);
		const auditLogsIds = auditLogs.map((auditLog) => auditLog.id);

		expect(auditLogsIds).toEqual([seeededUserAuditLog1.id, seeededUserAuditLog2.id]);
		expect(auditLogs).toHaveLength(2);

		assertAuditLog(auditLogs[0], seeededUserAuditLog1);
		assertAuditLog(auditLogs[1], seeededUserAuditLog2);
	});

	it("should throw ForbiddenError when the user who requested does not have the required permission", async () => {
		const seededUser = await seedUser({});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: 0,
			denyPermissions: 0,
		});

		const request: GetUserAuditLogsByUserIdDTO = {
			userId: seededUser.id,
			requestedById: seededUserRequestedBy.id,
		};

		let errorMessage = "";
		try {
			await getUserAuditLogsByUserIdController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have VIEW_USER_AUDIT_LOG permission`,
		);
	});
});
