import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IUserAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import type { GetUserAuditLogsByUserIdDTO } from "@/modules/user/src/dtos/userAuditLogDTO";
import { GetUserAuditLogsByUserIdUseCase } from "@/modules/user/src/useCases/userAuditLog/getUserAuditLogsByUserIdUseCase";
import { NotFoundError } from "@/shared/core/errors";
import { seedUser } from "../../utils/user/seedUser";
import { seedUserAuditLog } from "../../utils/userAuditLog/seedUserAuditLog";

const assertAuditLog = (auditLog: IUserAuditLog, expectedLog: IUserAuditLogRawObject) => {
	expect(auditLog.id).toBe(expectedLog.id);
	expect(auditLog.userId).toBe(expectedLog.userId);
	expect(auditLog.type.value).toBe(expectedLog.type);
	expect(auditLog.description).toBe(expectedLog.description);
	expect(auditLog.createdAt.toISOString()).toBe(expectedLog.createdAt.toISOString());
};

describe("GetUserAuditLogsByUserIdUseCase", () => {
	let getUserAuditLogsByUserIdUseCase: GetUserAuditLogsByUserIdUseCase;

	beforeAll(() => {
		getUserAuditLogsByUserIdUseCase = new GetUserAuditLogsByUserIdUseCase();
	});

	it("should return audit logs for a existing user", async () => {
		const seededUser = await seedUser({});
		const seeededUserAuditLog1 = await seedUserAuditLog({ userId: seededUser.id });
		const seeededUserAuditLog2 = await seedUserAuditLog({ userId: seededUser.id });

		const request: GetUserAuditLogsByUserIdDTO = {
			userId: seededUser.id,
			requestedById: seededUser.id,
		};

		const auditLogs = await getUserAuditLogsByUserIdUseCase.execute(request);
		const auditLogsIds = auditLogs.map((auditLog) => auditLog.id);

		expect(auditLogsIds).toEqual([seeededUserAuditLog1.id, seeededUserAuditLog2.id]);
		expect(auditLogs).toHaveLength(2);

		assertAuditLog(auditLogs[0], seeededUserAuditLog1);
		assertAuditLog(auditLogs[1], seeededUserAuditLog2);
	});

	it("should throw NotFoundError when user does not exist", async () => {
		const request: GetUserAuditLogsByUserIdDTO = {
			userId: "non-existing-user-id",
			requestedById: "non-existing-user-id",
		};

		let errorMessage = "";
		try {
			await getUserAuditLogsByUserIdUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;

			expect(error).toBeInstanceOf(NotFoundError);
		}

		expect(errorMessage).toBe(`User with ID ${request.userId} not found`);
	});
});
