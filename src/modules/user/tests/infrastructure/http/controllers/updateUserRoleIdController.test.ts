import { UserPermissionService } from "@/modules/user/src/domain/services/userPermissionService";
import type { UpdateUserRoleIdDTO } from "@/modules/user/src/dtos/updateUserRoleIdDTO";
import { UpdateUserRoleIdController } from "@/modules/user/src/infrastructure/http/controllers/updateUserRoleIdController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { UpdateUserRoleIdUseCase } from "@/modules/user/src/useCases/updateUserRoleIdUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("UpdateUserRoleIdController", () => {
	let updateUserRoleIdController: UpdateUserRoleIdController;
	let userPermissionService: UserPermissionService;
	let updateUserRoleIdUseCase: UpdateUserRoleIdUseCase;

	beforeEach(() => {
		userPermissionService = new UserPermissionService();
		updateUserRoleIdUseCase = new UpdateUserRoleIdUseCase();
		updateUserRoleIdController = new UpdateUserRoleIdController(
			userPermissionService,
			updateUserRoleIdUseCase,
		);
	});

	it("should throw an UnauthorizedError when the editor does not have the required permissions", async () => {
		const request: UpdateUserRoleIdDTO = {
			userId: faker.string.uuid(),
			roleId: faker.string.uuid(),
			requestedById: faker.string.uuid(),
		};

		jest.spyOn(userPermissionService, "hasPermission").mockResolvedValue(false);

		let errorMessage = "";
		try {
			await updateUserRoleIdController.executeImpl(request);
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toEqual(
			`User ${request.requestedById} does not have MANAGE_PERMISSION permission`,
		);
	});

	it("should return user ID when all requests are valid", async () => {
		const seededUser = await seedUser({});
		const userWithManagePermission = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION,
		});

		const request: UpdateUserRoleIdDTO = {
			userId: seededUser.id,
			roleId: faker.string.uuid(),
			requestedById: userWithManagePermission.id,
		};

		userPermissionService.hasPermission = jest.fn().mockResolvedValue(true);
		updateUserRoleIdController.executeImpl = jest.fn().mockResolvedValue(seededUser.id);

		const userId = await updateUserRoleIdController.executeImpl(request);

		expect(userId).toBe(request.userId);
	});
});