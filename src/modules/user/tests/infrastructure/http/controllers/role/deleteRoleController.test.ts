import type { DeleteRoleDTO } from "@/modules/user/src/dtos/userDTO";
import { DeleteRoleController } from "@/modules/user/src/infrastructure/http/controllers/role/deleteRoleController";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";

describe("DeleteRoleController", () => {
  let deleteRoleController: DeleteRoleController;

  beforeAll(() => {
    deleteRoleController = new DeleteRoleController();
  });

  it("should return role id when all request is valid", async () => {
    const seededUser = await seedUser({});
    const userWithManageRolePermission = await seedUser({
      allowPermissions: Permissions.MANAGE_ROLE,
      denyPermissions: 0,
    });

    const request: DeleteRoleDTO = {
      roleId: seededUser.id,
      requestedById: userWithManageRolePermission.id,
    };

    const roleId = await deleteRoleController.executeImpl(request);

    expect(roleId).toBe(request.roleId);
  });

  it("should throw a ForbiddenError when the user who requested does not have a required permissions", async () => {
    const request: DeleteRoleDTO = {
      roleId: faker.string.uuid(),
      requestedById: faker.string.uuid(),
    };

    let errorMessage = "";
    try {
      await deleteRoleController.executeImpl(request);
    } catch (error) {
      errorMessage = (error as Error).message;
    }

    expect(errorMessage).toEqual(
      `User ${request.requestedById} does not have MANAGE_ROLE permission`
    );
  });
});
