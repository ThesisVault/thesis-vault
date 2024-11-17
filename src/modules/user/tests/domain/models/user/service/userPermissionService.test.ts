import { db } from "@/shared/infrastructure/database";
import { UserPermissionService } from "@/modules/user/src/domain/models/user/service/userPermissionService";
import { seedUser } from "@/modules/user/tests/utils/seedUser";
import { Permissions } from "@/modules/user/src/domain/models/user/shared/permission/permissions";

describe("UserPermissionService", () => {
  let userPermissionService: UserPermissionService;
  
  beforeAll(async () => {
    userPermissionService = new UserPermissionService();
  });
  
  afterEach(async () => {
    await db.user.deleteMany();
  })
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  describe("hasPermission", () => {
    it("should return true when the user has the specified permission", async () => {
      const seededUser = await seedUser({
        permissions: Permissions.MANAGE_PERMISSION | Permissions.VIEW_SUBMITTED_THESIS
      });
      const userHasManageUserPermission = await userPermissionService.hasPermission(seededUser.id, "MANAGE_PERMISSION");
      
      expect(userHasManageUserPermission).toBe(true);
    })
    
    it("should return false when the user doesn't have specified permission", async () => {
      const seededUser = await seedUser({
        permissions: Permissions.DELETE_USER | Permissions.UPDATE_USER
      });
      const userHasManageUserPermission = await userPermissionService.hasPermission(seededUser.id, "MANAGE_PERMISSION");
      
      expect(userHasManageUserPermission).toBe(false);
    })
  })
})
