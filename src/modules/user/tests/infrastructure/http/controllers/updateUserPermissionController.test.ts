import { UpdateUserPermissionController } from "@/modules/user/src/infrastructure/http/controllers/updateUserPermissionController";
import { UserPermissionService } from "@/modules/user/src/domain/models/user/service/userPermissionService";
import { UpdateUserPermissionUseCase } from "@/modules/user/src/useCases/updateUserPermissionUseCase";
import { UnauthorizedError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";
import { Roles } from "@/modules/user/src/domain/models/user/shared/permission/roles";
import { Permissions } from "@/modules/user/src/domain/models/user/shared/permission/permissions";
import type { UserDTO, UpdateUserPermissionDTO } from "@/modules/user/src/dtos/userDTO";

jest.mock('@/modules/user/src/domain/models/user/service/userPermissionService');
jest.mock('@/modules/user/src/useCases/updateUserPermissionUseCase');

describe('UpdateUserPermissionController', () => {
  let controller: UpdateUserPermissionController;
  let userPermissionServiceMock: jest.Mocked<UserPermissionService>;
  let updateUserPermissionUseCaseMock: jest.Mocked<UpdateUserPermissionUseCase>;
  
  beforeEach(() => {
    userPermissionServiceMock = new UserPermissionService() as jest.Mocked<UserPermissionService>;
    updateUserPermissionUseCaseMock = new UpdateUserPermissionUseCase() as jest.Mocked<UpdateUserPermissionUseCase>;
    
    controller = new UpdateUserPermissionController(userPermissionServiceMock, updateUserPermissionUseCaseMock);
  });
  
  it('should successfully update the user role when permissions are valid', async () => {
    const request: UpdateUserPermissionDTO = {
      userToEditId: faker.string.uuid(),
      editorId: faker.string.uuid(),
      permissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
    };
    
    userPermissionServiceMock.hasPermission.mockResolvedValue(true);
    
    const mockUpdatedUser: UserDTO = {
      id: request.userToEditId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(Object.values(Roles)),
      permissions: request.permissions,
    };
    updateUserPermissionUseCaseMock.execute.mockResolvedValue(mockUpdatedUser);
    
    const result = await controller.execute(request);
    
    expect(result.id).toBe(mockUpdatedUser.id);
    expect(result.name).toBe(mockUpdatedUser.name);
    expect(result.email).toBe(mockUpdatedUser.email);
    expect(result.role).toBe(mockUpdatedUser.role);
    expect(result.permissions).toBe(mockUpdatedUser.permissions);
  });
  
  it('should throw an UnauthorizedError if the editor does not have the required permissions', async () => {
    const request: UpdateUserPermissionDTO = {
      userToEditId: faker.string.uuid(),
      editorId: faker.string.uuid(),
      permissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
    };
    
    userPermissionServiceMock.hasPermission.mockResolvedValue(false);
    
    await expect(controller.execute(request)).rejects.toThrow(UnauthorizedError);
  });
});
