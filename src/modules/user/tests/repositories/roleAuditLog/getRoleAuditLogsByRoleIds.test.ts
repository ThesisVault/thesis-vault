import type { IRoleAuditLog } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLog";
import type { IRoleAuditLogRawObject } from "@/modules/user/src/domain/models/roleAuditLog/constant";
import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
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

describe("RoleAuditLogRepository.getRoleAuditLogsByRoleIds", () => {
	let roleAuditLogRepository: IRoleAuditLogRepository;

	beforeAll(() => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	it("should retrieve a roleAuditLogs by roleIds", async () => {
		const seededRoleOne = await seedRole({});
		const seededRoleTwo = await seedRole({});
		const seededRoleAuditLogOne = await seedRoleAuditLog({ roleId: seededRoleOne.id });
		const seededRoleAuditLogTwo = await seedRoleAuditLog({ roleId: seededRoleTwo.id });

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByRoleIds([
			seededRoleOne.id,
			seededRoleTwo.id,
		]);

		expect(roleAuditLogs.length).toBe(2);
		assertRoleAuditLog(roleAuditLogs[0], seededRoleAuditLogOne);
		assertRoleAuditLog(roleAuditLogs[1], seededRoleAuditLogTwo);
	});
	
	it("should retrieve a roleAuditLogs by roleIds where role have a lot of changes", async () => {
		const seededRoleOne = await seedRole({});
		const seededRoleTwo = await seedRole({});
		const seededRoleAuditLogOne = await seedRoleAuditLog({ roleId: seededRoleOne.id });
		const seededRoleAuditLogTwo = await seedRoleAuditLog({ roleId: seededRoleOne.id });
		const seededRoleAuditLogThree = await seedRoleAuditLog({ roleId: seededRoleOne.id });
		const seededRoleAuditLogFour = await seedRoleAuditLog({ roleId: seededRoleTwo.id });
		const seededRoleAuditLogFive = await seedRoleAuditLog({ roleId: seededRoleTwo.id });
		const seededRoleAuditLogSix = await seedRoleAuditLog({ roleId: seededRoleTwo.id });
		
		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByRoleIds([
			seededRoleOne.id,
			seededRoleTwo.id,
		]);
		
		expect(roleAuditLogs.length).toBe(6);
		assertRoleAuditLog(roleAuditLogs[0], seededRoleAuditLogOne);
		assertRoleAuditLog(roleAuditLogs[1], seededRoleAuditLogTwo);
		assertRoleAuditLog(roleAuditLogs[2], seededRoleAuditLogThree);
		assertRoleAuditLog(roleAuditLogs[3], seededRoleAuditLogFour);
		assertRoleAuditLog(roleAuditLogs[4], seededRoleAuditLogFive);
		assertRoleAuditLog(roleAuditLogs[5], seededRoleAuditLogSix);
	});

	it("should only retrieve 1 roleAuditLog", async () => {
		const seededRole = await seedRole({});
		const seededRoleAuditLog = await seedRoleAuditLog({ roleId: seededRole.id });

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByRoleIds([
			seededRole.id,
			"non-existing-roleId",
		]);

		expect(roleAuditLogs.length).toBe(1);
		assertRoleAuditLog(roleAuditLogs[0], seededRoleAuditLog);
		expect(roleAuditLogs[2]).toBeUndefined();
	});

	it("should return null when given non-existing roleAuditLog id", async () => {
		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByRoleIds([
			"non-existing-role-audit-log-id",
		]);

		expect(roleAuditLogs.length).toBe(0);
		expect(roleAuditLogs).toEqual([]);
	});
});
