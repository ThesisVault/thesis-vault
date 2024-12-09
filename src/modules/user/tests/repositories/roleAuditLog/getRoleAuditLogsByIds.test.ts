import type { IRoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import type { IRoleAuditLogRawObject } from "@/modules/user/src/domain/models/roleAuditLog/constant";
import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";

const assertRoleAuditLog = (
	roleAuditLog: IRoleAuditLog,
	expectedRoleAuditLog: IRoleAuditLogRawObject,
) => {
	expect(roleAuditLog.id).toBe(expectedRoleAuditLog.id);
	expect(roleAuditLog.userId).toBe(expectedRoleAuditLog.userId);
	expect(roleAuditLog.typeValue).toBe(expectedRoleAuditLog.type);
	expect(roleAuditLog.description).toBe(expectedRoleAuditLog.description);
	expect(roleAuditLog.roleId).toBe(expectedRoleAuditLog.roleId);
	expect(roleAuditLog.createdAt.toISOString()).toBe(expectedRoleAuditLog.createdAt.toISOString());
};

describe("RoleAuditLogRepository.getRoleAuditLogsByIds", () => {
	let roleAuditLogRepository: IRoleAuditLogRepository;

	beforeAll(() => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	it("should retrieve a roleAuditLogs by Ids", async () => {
		const seededUserRoleLogOne = await seedRoleAuditLog({});
		const seededUserRoleLogTwo = await seedRoleAuditLog({});

		const userAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByIds([
			seededUserRoleLogOne.id,
			seededUserRoleLogTwo.id,
		]);

		assertRoleAuditLog(userAuditLogs[0], seededUserRoleLogOne);
		assertRoleAuditLog(userAuditLogs[1], seededUserRoleLogTwo);
	});

	it("should only retrieve roleAuditLogs", async () => {
		const seededRoleAuditLogOne = await seedRoleAuditLog({});
		const seededRoleAuditLogTwo = await seedRoleAuditLog({});
		const seededRoleAuditLogThree = "non-existing-user-id";

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByIds([
			seededRoleAuditLogOne.id,
			seededRoleAuditLogTwo.id,
			seededRoleAuditLogThree,
		]);

		assertRoleAuditLog(roleAuditLogs[0], seededRoleAuditLogOne);
		assertRoleAuditLog(roleAuditLogs[1], seededRoleAuditLogTwo);
		expect(roleAuditLogs[2]).toBeUndefined();
	});

	it("should return null when given non-existing roleAuditLog id", async () => {
		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByIds([
			"non-existing-role-audit-log-id",
		]);

		expect(roleAuditLogs.length).toBe(0);
		expect(roleAuditLogs).toEqual([]);
	});
});
