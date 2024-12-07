import {
	type IRoleAuditLogService,
	RoleAuditLogService,
} from "@/modules/user/src/domain/services/roleAuditLogService";
import {
	type IRoleRepository,
	RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import { DeleteRoleUseCase } from "@/modules/user/src/useCases/role/deleteRoleUseCase";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { NotFoundError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";

describe("DeleteRoleUseCase", () => {
	let deleteRoleUseCase: DeleteRoleUseCase;
	let roleRepository: IRoleRepository;
	let roleAuditLogService: IRoleAuditLogService;

	beforeEach(() => {
		roleRepository = new RoleRepository();
		roleAuditLogService = new RoleAuditLogService();
		deleteRoleUseCase = new DeleteRoleUseCase(roleRepository, roleAuditLogService);
	});

	it("should successfully soft delete a role", async () => {
		const seededRole = await seedRole({});
		const seededAdminUser = await seedRole({
			roleId: faker.string.uuid(),
		});

		const request = {
			roleId: seededRole.id,
			requestedById: seededAdminUser.id,
		};

		const result = await deleteRoleUseCase.execute(request);

		expect(result).toBe(request.roleId);

		const deletedRole = await roleRepository.getRoleById(seededRole.id);
		expect(deletedRole).not.toBeNull();
		expect(deletedRole!.isDeleted).toBe(true);
		expect(deletedRole!.deletedAt).toBeInstanceOf(Date);

		expect(
			await roleAuditLogService.createAndSaveRoleAuditLog({
				userId: request.requestedById,
				description: `Deleted Role with ID: ${seededRole.id}`,
				type: "DELETE",
			}),
		).toBeDefined();
	});

	it("should throw NotFoundError when the role does not exist", async () => {
		const request = {
			roleId: faker.string.uuid(),
			requestedById: faker.string.uuid(),
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
