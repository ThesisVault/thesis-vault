import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedRoleAuditLog } from "@/modules/user/tests/utils/roleAuditLog/seedRoleAuditLog";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";
import { faker } from "@faker-js/faker";

describe("RoleAuditLogRepository.getRoleAuditLogsByPagination", () => {
	let roleAuditLogRepository: IRoleAuditLogRepository;

	beforeAll(async () => {
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	beforeEach(async () => {
		await db.roleAuditLog.deleteMany();
	});

	it("should retrieve roleAuditLogs without filters", async () => {
		const seededRoleAuditLogOne = await seedRoleAuditLog({});
		const seededRoleAuditLogTwo = await seedRoleAuditLog({});
		const seededRoleAuditLogThree = await seedRoleAuditLog({});

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByPagination({
			skip: 0,
			size: 3,
		});
		const roleAuditLogsIds = roleAuditLogs.map((roleAuditLog) => roleAuditLog.id);

		expect(roleAuditLogs.length).toBe(3);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogOne.id);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogTwo.id);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogThree.id);
	});

	it("should retrieve roleAuditLogs filtered by roleId", async () => {
		const seededRole = await seedRole({});
		const seededRoleAuditLogOne = await seedRoleAuditLog({ roleId: seededRole.id });
		const seededRoleAuditLogTwo = await seedRoleAuditLog({ roleId: seededRole.id });
		const seededRoleAuditLogThree = await seedRoleAuditLog({});

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByPagination(
			{ skip: 0, size: 3 },
			{ roleId: seededRole.id },
		);
		const roleAuditLogsIds = roleAuditLogs.map((roleAuditLog) => roleAuditLog.id);

		expect(roleAuditLogs.length).toBe(2);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogOne.id);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogTwo.id);
		expect(roleAuditLogsIds).not.toContain(seededRoleAuditLogThree.id);
	});

	it("should retrieve roleAuditLogs filtered by userId", async () => {
		const seededUser = await seedUser({});
		const seededRoleAuditLogOne = await seedRoleAuditLog({ userId: seededUser.id });
		const seededRoleAuditLogTwo = await seedRoleAuditLog({});
		const seededRoleAuditLogThree = await seedRoleAuditLog({ userId: seededUser.id });

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByPagination(
			{ skip: 0, size: 3 },
			{ userId: seededUser.id },
		);
		const roleAuditLogsIds = roleAuditLogs.map((roleAuditLog) => roleAuditLog.id);

		expect(roleAuditLogs.length).toBe(2);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogOne.id);
		expect(roleAuditLogsIds).not.toContain(seededRoleAuditLogTwo.id);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogThree.id);
	});

	it("should retrieve roleAuditLogs with combined roleId and userId", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});
		const seededRoleAuditLogOne = await seedRoleAuditLog({ userId: seededUser.id });
		const seededRoleAuditLogTwo = await seedRoleAuditLog({
			userId: seededUser.id,
			roleId: seededRole.id,
		});
		const seededRoleAuditLogThree = await seedRoleAuditLog({ roleId: seededRole.id });

		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByPagination(
			{ skip: 0, size: 3 },
			{ userId: seededUser.id, roleId: seededRole.id },
		);
		const roleAuditLogsIds = roleAuditLogs.map((roleAuditLog) => roleAuditLog.id);

		expect(roleAuditLogs.length).toBe(1);
		expect(roleAuditLogsIds).not.toContain(seededRoleAuditLogOne.id);
		expect(roleAuditLogsIds).toContain(seededRoleAuditLogTwo.id);
		expect(roleAuditLogsIds).not.toContain(seededRoleAuditLogThree.id);
	});

	it("should return empty array when filter doesn't match anything", async () => {
		const roleAuditLogs = await roleAuditLogRepository.getRoleAuditLogsByPagination(
			{ skip: 0, size: 3 },
			{ userId: faker.string.uuid() },
		);

		expect(roleAuditLogs.length).toBe(0);
	});
});
