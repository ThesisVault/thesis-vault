import {
	type IRoleAuditLogRepository,
	RoleAuditLogRepository
} from "@/modules/user/src/repositories/roleAuditLogRepository";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { DeleteRoleUseCase } from "@/modules/user/src/useCases/role/deleteRoleUseCase";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { NotFoundError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";

describe("DeleteRoleUseCase", () => {
	let deleteRoleUseCase: DeleteRoleUseCase;
	let roleRepository: IRoleRepository;
	let roleAuditLogRepository: IRoleAuditLogRepository;

	beforeEach(() => {
		roleRepository = new RoleRepository();
		deleteRoleUseCase = new DeleteRoleUseCase();
		roleAuditLogRepository = new RoleAuditLogRepository();
	});

	it("should successfully soft delete a role", async () => {
		const seededRole = await seedRole({});
		const seededUserRequestedBy = await seedUser({});

		const request = {
			roleId: seededRole.id,
			requestedById: seededUserRequestedBy.id,
		};

		const result = await deleteRoleUseCase.execute(request);

		expect(result).toBe(request.roleId);

		const deletedRole = await roleRepository.getRoleById(seededRole.id, {
			includeDeleted: true,
		});

		expect(deletedRole).not.toBeNull();
		expect(deletedRole!.isDeleted).toBe(true);
		expect(deletedRole!.deletedAt).toBeInstanceOf(Date);
		
		const roleAuditLog = await roleAuditLogRepository.getRoleAuditLogByRoleId(
			seededRole.id
		);
		
		expect(roleAuditLog).not.toBeNull();
		expect(roleAuditLog!.userId).toBe(request.requestedById);
		expect(roleAuditLog!.description).toBe(
			`Deleted Role with ID: ${seededRole.id}`
		);
		expect(roleAuditLog!.createdAt).toBeInstanceOf(Date);
	});

	it("should throw NotFoundError when the role does not exist", async () => {
		const request = {
			roleId: faker.string.uuid(),
			requestedById: (await seedUser({})).id,
		};

		let errorMessage = "";
		try {
			await deleteRoleUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}

		expect(errorMessage).toEqual(`Role ${request.roleId} not found`);
	});
});
