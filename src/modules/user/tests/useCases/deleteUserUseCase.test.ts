import {
  type IUserAuditLogRepository,
  UserAuditLogRepository,
} from "@/modules/user/src/repositories/userAuditLogRepository";
import {
  type IUserRepository,
  UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { DeleteUserUseCase } from "@/modules/user/src/useCases/user/deleteUserUseCase";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { NotFoundError } from "@/shared/core/errors";
import { faker } from "@faker-js/faker";

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: IUserRepository;
  let userAuditLogRepository: IUserAuditLogRepository;

  beforeEach(() => {
    deleteUserUseCase = new DeleteUserUseCase();
    userRepository = new UserRepository();
    userAuditLogRepository = new UserAuditLogRepository();
  });

  it("should successfully soft delete a user", async () => {
    const seededUser = await seedUser({});
    const seededUserWithPermission = await seedUser({});
    const request = {
      userId: seededUser.id,
      requestedById: seededUserWithPermission.id,
    };
    const result = await deleteUserUseCase.execute(request);

    expect(result).toBe(request.userId);

    const deletedUser = await userRepository.getUserById(seededUser.id, {
      includeDeleted: true,
    });

    expect(deletedUser!.id).toBe(seededUser.id);
    expect(deletedUser!.isDeleted).toBe(true);
    expect(deletedUser!.deletedAt).toBeInstanceOf(Date);

    const userAuditLog = await userAuditLogRepository.getUserAuditLogsByUserId(
      seededUserWithPermission.id
    );

    expect(userAuditLog.length).toBe(1);
    expect(userAuditLog[0].userId).toBe(request.requestedById);
    expect(userAuditLog[0].description).toBe(
      `Deleted User with ID: ${seededUser.id}`
    );
    expect(userAuditLog[0].createdAt).toBeInstanceOf(Date);
  });

  it("should throw NotFoundError when the user does not exist", async () => {
    const request = {
      userId: faker.string.uuid(),
      requestedById: faker.string.uuid(),
    };

    let errorMessage = "";
    try {
      await deleteUserUseCase.execute(request);
    } catch (error) {
      errorMessage = (error as Error).message;
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(errorMessage).toBe(`User ${request.userId} not found`);
  });
});
