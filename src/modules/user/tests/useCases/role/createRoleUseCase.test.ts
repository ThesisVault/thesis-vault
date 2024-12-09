import type { CreateRoleDTO } from "@/modules/user/src/dtos/roleDTO";
import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository,
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import { RoleRepository } from "@/modules/user/src/repositories/roleRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { CreateRoleUseCase } from "@/modules/user/src/useCases/role/createRoleUseCase";
import { faker } from "@faker-js/faker";
import { seedUser } from "../../utils/user/seedUser";

describe("CreateRoleUseCase", () => {
	let createRoleUseCase: CreateRoleUseCase;
	let roleRepository: RoleRepository;
	let roleAuditLogRepository: IRoleAuditLogRepository;

	beforeAll(() => {
		createRoleUseCase = new CreateRoleUseCase();
		roleRepository = new RoleRepository();
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	it("should successfully create a role", async () => {
		const user = await seedUser({});

		const request: CreateRoleDTO = {
			name: faker.word.noun(),
			color: faker.color.rgb(),
			permissions: Permissions.MANAGE_PERMISSION,
			requestedById: user.id,
		};

		const result = await createRoleUseCase.execute(request);
		const createdRole = await roleRepository.getRoleById(result);

		expect(createdRole).not.toBeNull();
		expect(createdRole!.nameValue).toBe(request!.name);
		expect(createdRole!.color).toBe(request!.color);
		expect(createdRole!.permissionsValue).toBe(request!.permissions);
		console.log(result);

		const roleAuditLog = await roleAuditLogRepository.getRoleAuditLogByRoleId(result);

		expect(roleAuditLog).not.toBeNull();
		expect(roleAuditLog!.userId).toBe(request.requestedById);
		expect(roleAuditLog!.description).toBe(`Create Role with ID: ${result}`);
		expect(roleAuditLog!.createdAt).toBeInstanceOf(Date);
	});
});
