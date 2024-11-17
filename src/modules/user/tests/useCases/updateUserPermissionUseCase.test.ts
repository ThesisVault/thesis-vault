import { UpdateUserPermissionUseCase } from "@/modules/user/src/useCases/updateUserPermissionUseCase";
import type { IUserRepository } from "@/modules/user/src/repositories/userRepository";
import { BadRequestError, NotFoundError, UnexpectedError } from "@/shared/core/errors";
import type { UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { faker } from "@faker-js/faker";
import { Permissions } from "@/modules/user/src/domain/models/user/shared/permission/permissions";
import { createUserDomainObject } from "@/modules/user/tests/utils/createUserDomainObject";

describe("UpdateUserPermissionUseCase", () => {
	let updateUserPermissionUseCase: UpdateUserPermissionUseCase;
	let userRepositoryMock: jest.Mocked<IUserRepository>;

	beforeEach(() => {
		userRepositoryMock = {
			getUserById: jest.fn(),
			getUsersByIds: jest.fn(),
			updateUser: jest.fn(),
			updateUsers: jest.fn(),
		} as jest.Mocked<IUserRepository>;

		updateUserPermissionUseCase = new UpdateUserPermissionUseCase(userRepositoryMock);
	});

	it("should throw NotFoundError if user does not exist", async () => {
		const request: UpdateUserPermissionDTO = {
			userToEditId: "non-existent-id",
			editorId: faker.string.uuid(),
			permissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
		};

		userRepositoryMock.getUserById.mockResolvedValue(null);

		await expect(updateUserPermissionUseCase.execute(request)).rejects.toThrow(NotFoundError);
	});

	it("should throw BadRequestError if the permissions are invalid", async () => {
		const request: UpdateUserPermissionDTO = {
			userToEditId: faker.string.uuid(),
			editorId: faker.string.uuid(),
			permissions: -1,
		};

		await expect(updateUserPermissionUseCase.execute(request)).rejects.toThrow(BadRequestError);
	});

	it("should throw UnexpectedError if the user update fails", async () => {
		const request: UpdateUserPermissionDTO = {
			userToEditId: faker.string.uuid(),
			editorId: faker.string.uuid(),
			permissions: 3,
		};

		userRepositoryMock.getUserById.mockResolvedValue(
			createUserDomainObject({
				id: request.userToEditId,
			}),
		);
		userRepositoryMock.updateUser.mockResolvedValue(null);

		await expect(updateUserPermissionUseCase.execute(request)).rejects.toThrow(UnexpectedError);
	});

	it("should successfully update user permission, save it and return it as UserDTO", async () => {
		const request: UpdateUserPermissionDTO = {
			userToEditId: faker.string.uuid(),
			editorId: faker.string.uuid(),
			permissions: 3,
		};

		userRepositoryMock.getUserById.mockResolvedValue(
			createUserDomainObject({
				id: request.userToEditId,
			}),
		);
		userRepositoryMock.updateUser.mockResolvedValue(
			createUserDomainObject({
				id: request.userToEditId,
				permissions: request.permissions,
			}),
		);

		const updateUserPermissionUseCaseResult = await updateUserPermissionUseCase.execute(request);

		expect(updateUserPermissionUseCaseResult.id).toBe(request.userToEditId);
		expect(updateUserPermissionUseCaseResult.permissions).toBe(request.permissions);
	});
});
