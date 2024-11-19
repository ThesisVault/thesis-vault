import {
	type IUserPermissionService,
	UserPermissionService,
} from "@/modules/user/src/domain/services/userPermissionService";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

describe("Test UserPermissionService", () => {
	let userPermissionService: IUserPermissionService;

	beforeAll(() => {
		userPermissionService = new UserPermissionService();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	describe("hasPermission", () => {
		it("should return true when user has a specific permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: Permissions.UPDATE_USER | Permissions.DELETE_THESIS,
				denyPermissions: Permissions.DELETE_USER,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "UPDATE_USER");
			expect(hasPermission).toBe(true);
		});

		it("should return true when user has super admin permission", async () => {
			const seededUser = await seedUser({
				isSuperAdmin: true,
				allowPermissions: 0,
				denyPermissions: 0,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "UPDATE_USER");
			expect(hasPermission).toBe(true);
		});

		it("should return true when user permission allows a permission that the role denies", async () => {
			const seededRole = await seedRole({
				permissions: Permissions.DELETE_USER,
			});
			const seededUser = await seedUser({
				roleId: seededRole.id,
				allowPermissions: Permissions.UPDATE_USER,
				denyPermissions: Permissions.DELETE_USER | Permissions.DELETE_THESIS,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "UPDATE_USER");
			expect(hasPermission).toBe(true);
		});

		it("should return true when user role permission allow permission even without user permission", async () => {
			const seededRole = await seedRole({
				permissions: Permissions.UPDATE_USER,
			});
			const seededUser = await seedUser({
				roleId: seededRole.id,
				allowPermissions: 0,
				denyPermissions: 0,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "UPDATE_USER");
			expect(hasPermission).toBe(true);
		});

		it("should return true when user permission allow permission despite missing role", async () => {
			const seededUser = await seedUser({
				roleId: null,
				allowPermissions: Permissions.UPDATE_USER,
				denyPermissions: Permissions.DELETE_USER | Permissions.DELETE_THESIS,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "UPDATE_USER");
			expect(hasPermission).toBe(true);
		});

		it("should return false when user does not have the specific permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: Permissions.UPDATE_USER | Permissions.DELETE_THESIS,
				denyPermissions: Permissions.DELETE_USER,
			});

			const hasPermission = await userPermissionService.hasPermission(
				seededUser.id,
				"VIEW_RESOURCES",
			);
			expect(hasPermission).toBe(false);
		});

		it("should return false when user explicitly denies a permission", async () => {
			const seededUser = await seedUser({
				allowPermissions: Permissions.UPDATE_USER | Permissions.DELETE_THESIS,
				denyPermissions: Permissions.DELETE_USER,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "DELETE_USER");
			expect(hasPermission).toBe(false);
		});

		it("should return false when user permission denies a permission that the role allows", async () => {
			const seededRole = await seedRole({
				permissions: Permissions.DELETE_USER,
			});
			const seededUser = await seedUser({
				roleId: seededRole.id,
				allowPermissions: 0,
				denyPermissions: Permissions.DELETE_USER,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "DELETE_USER");
			expect(hasPermission).toBe(false);
		});

		it("should return false when user permission denies permission despite missing role", async () => {
			const seededUser = await seedUser({
				roleId: null,
				allowPermissions: Permissions.UPDATE_USER,
				denyPermissions: Permissions.DELETE_USER | Permissions.DELETE_THESIS,
			});

			const hasPermission = await userPermissionService.hasPermission(seededUser.id, "DELETE_USER");
			expect(hasPermission).toBe(false);
		});
	});

	describe("hasSuperAdmin", () => {
		it("should return true when user is super admin", async () => {
			const seededUser = await seedUser({ isSuperAdmin: true });

			const hasSuperAdmin = await userPermissionService.hasSuperAdmin(seededUser.id);
			expect(hasSuperAdmin).toBe(true);
		});

		it("should return false when user is not super admin", async () => {
			const seededUser = await seedUser({ isSuperAdmin: false });

			const hasSuperAdmin = await userPermissionService.hasSuperAdmin(seededUser.id);
			expect(hasSuperAdmin).toBe(false);
		});
	});
});
