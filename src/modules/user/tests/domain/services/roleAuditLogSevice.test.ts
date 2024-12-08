import {
	type IRoleAuditLogService,
	RoleAuditLogService,
} from "@/modules/user/src/domain/services/roleAuditLogService";
import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("RoleAuditLogService", () => {
	let roleAuditLogService: IRoleAuditLogService;
	let roleAuditLogRepository: IRoleAuditLogRepository;

	beforeAll(() => {
		roleAuditLogRepository = new RoleAuditLogRepository();
		roleAuditLogService = new RoleAuditLogService();
	});

	it("should successfully create an audit log", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});
		const params = {
			userId: seededUser.id,
			roleId: seededRole.id,
			type: "DELETE",
			description: `${seededRole.name} deleted!`,
		};

		await roleAuditLogService.createAndSaveRoleAuditLog(params);

		const roleAuditLog = await roleAuditLogRepository.getRoleAuditLogByRoleId(seededRole.id);

		expect(roleAuditLog).not.toBeNull();
		expect(roleAuditLog!.userId).toBe(params.userId);
		expect(roleAuditLog!.typeValue).toBe(params.type);
		expect(roleAuditLog!.description).toBe(params.description);
		expect(roleAuditLog!.createdAt).toBeInstanceOf(Date);
	});
});
