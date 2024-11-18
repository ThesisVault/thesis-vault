import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";
import { UserPermission } from "@/modules/user/src/domain/models/user/classes/userPermission";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { faker } from "@faker-js/faker";

describe("User", () => {
	const mockUserData = {
		id: faker.string.uuid(),
		name: UserName.create(faker.person.fullName()).getValue(),
		email: faker.internet.email(),
		emailVerified: null,
		image: faker.image.url(),
		roleId: null,
		isSuperAdmin: false,
		allowPermissions: UserPermission.create(
			faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
		).getValue(),
		denyPermissions: UserPermission.create(
			faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
		).getValue(),
		isDeleted: false,
		deletedAt: null,
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
	};

	it("should create a User", () => {
		const user = User.create(mockUserData);

		expect(user).toBeInstanceOf(User);
		expect(user.id).toBe(mockUserData.id);
		expect(user.nameValue).toBe(mockUserData.name.value);
		expect(user.email).toBe(mockUserData.email);
		expect(user.image).toBe(mockUserData.image);
		expect(user.roleId).toBe(mockUserData.roleId);
		expect(user.isSuperAdmin).toBe(mockUserData.isSuperAdmin);
		expect(user.allowPermissionsValue).toBe(mockUserData.allowPermissions.value);
		expect(user.denyPermissionsValue).toBe(mockUserData.denyPermissions.value);
		expect(user.createdAt.toString()).toBe(mockUserData.createdAt.toString());
		expect(user.updatedAt.toString()).toBe(mockUserData.updatedAt.toString());
	});
});
