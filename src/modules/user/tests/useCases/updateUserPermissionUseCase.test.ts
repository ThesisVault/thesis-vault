import type { UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { type IUserRepository, UserRepository } from "@/modules/user/src/repositories/userRepository";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { UpdateUserPermissionUseCase } from "@/modules/user/src/useCases/updateUserPermissionUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { BadRequestError, NotFoundError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";

describe("UpdateUserPermissionUseCase", () => {
	let updateUserPermissionUseCase: UpdateUserPermissionUseCase;
	let userRepository: IUserRepository;
	
	beforeAll(() => {
		updateUserPermissionUseCase = new UpdateUserPermissionUseCase();
		userRepository = new UserRepository();
	})
	
	it("should throw NotFoundError if user does not exist", async () => {
		const request: UpdateUserPermissionDTO = {
			userId: "non-existent-id",
			requestedById: faker.string.uuid(),
			allowPermission: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
			denyPermission: 0,
		};
		
		let errorMessage = '';
		try {
			await updateUserPermissionUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(NotFoundError);
		}
		
		expect(errorMessage).toBe(`User ${request.userId} not found`)
	});
	
	it("should throw BadRequestError if the permissions are invalid", async () => {
		const seededUser = await seedUser({});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION
		});
		const request: UpdateUserPermissionDTO = {
			userId: seededUser.id,
			requestedById: seededUserRequestedBy.id,
			allowPermission: -1,
			denyPermission: 0,
		};
		
		let errorMessage = '';
		try {
			await updateUserPermissionUseCase.execute(request);
		} catch (error) {
			errorMessage = (error as Error).message;
			expect(error).toBeInstanceOf(BadRequestError);
		}
		
		expect(errorMessage).toContain("Failed to update permission");
	});
	
	it("should successfully update user permission and return userId", async () => {
		const seededUser = await seedUser({
			allowPermissions: 0,
		});
		const seededUserRequestedBy = await seedUser({
			allowPermissions: Permissions.MANAGE_PERMISSION
		});
		const request: UpdateUserPermissionDTO = {
			userId: seededUser.id,
			requestedById: seededUserRequestedBy.id,
			allowPermission: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
			denyPermission: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
		};
		
		const userId = await updateUserPermissionUseCase.execute(request);
		expect(userId).toBe(request.userId);
		
		const updatedUser = await userRepository.getUserById(request.userId);
		expect(updatedUser!.id).toBe(request.userId);
		expect(updatedUser!.allowPermissionsValue).toBe(request.allowPermission);
		expect(updatedUser!.denyPermissionsValue).toBe(request.denyPermission);
	});
});
