import type { GetRoleByIdDTO } from "@/modules/user/src/dtos/userDTO";
import { GetRoleByIdController } from "@/modules/user/src/infrastructure/http/controllers/role/getRoleByIdController";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

describe("GetRoleByIdController", () => {
  let getRoleByIdController: GetRoleByIdController;

  beforeAll(() => {
    getRoleByIdController = new GetRoleByIdController();
  });

  it("should return role when roleId exist", async () => {
    const seededRole = await seedRole({});
    const seededUserRequestedBy = await seedUser({});

    const request: GetRoleByIdDTO = {
      roleId: seededRole.id,
      requestedById: seededUserRequestedBy.id,
    };

    const result = await getRoleByIdController.executeImpl(request);

    expect(result!.id).toBe(request.roleId);
    expect(result!.nameValue).toBe(seededRole.name);
    expect(result!.color).toBe(seededRole.color);
    expect(result!.permissionsValue).toBe(seededRole.permissions);
  });

  it("should return null when roleId does not exist", async () => {
    const seededUserRequestedBy = await seedUser({});

    const request: GetRoleByIdDTO = {
      roleId: "non-existing-id",
      requestedById: seededUserRequestedBy.id,
    };

    const result = await getRoleByIdController.executeImpl(request);

    expect(result).toBeNull();
  });
});
