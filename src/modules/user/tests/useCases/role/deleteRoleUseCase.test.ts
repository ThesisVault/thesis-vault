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
	// let roleAuditLogRepository: IRoleAuditLogRepository; TODO: apply roleAuditLog here when RoleAuditLog is done

	beforeEach(() => {
		roleRepository = new RoleRepository();
	//	roleAuditLogRepository = new roleAuditLogRepository(); TODO: apply roleAuditLog here when RoleAuditLog is done
		deleteRoleUseCase = new DeleteRoleUseCase();
	});

	it("should successfully soft delete a role", async () => {
		const seededRole = await seedRole({});
		const seededUserWithPermission = await seedRole({});

		const request = {
			roleId: seededRole.id,
			requestedById: seededUserWithPermission.id,
		};

		const result = await deleteRoleUseCase.execute(request);

		expect(result).toBe(request.roleId);

		const deletedRole = await roleRepository.getRoleById(seededRole.id, {
			includeDeleted: true,
		});

		expect(deletedRole).not.toBeNull();
		expect(deletedRole!.isDeleted).toBe(true);
		expect(deletedRole!.deletedAt).toBeInstanceOf(Date);

		// TODO: apply roleAuditLog here when RoleAuditLog is done

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
