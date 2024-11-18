import { User } from "@/modules/user/src/domain/models/user/classes/user";
import { type IUserFactory, UserFactory } from "@/modules/user/src/domain/models/user/factory";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { faker } from "@faker-js/faker";

describe("UserFactory", () => {
	let mockUserData: IUserFactory;

	beforeEach(() => {
		mockUserData = {
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			email: faker.internet.email(),
			image: faker.image.url(),
			roleId: null,
			isSuperAdmin: faker.datatype.boolean(),
			allowPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
			denyPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
			isDeleted: false,
			deletedAt: null,
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
		};
	});

	it("should successfully create a User when all properties are valid", () => {
		const result = UserFactory.create(mockUserData);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(User);

		const user = result.getValue();
		expect(user.id).toBe(mockUserData.id);
		expect(user.nameValue).toBe(mockUserData.name);
		expect(user.email).toBe(mockUserData.email);
		expect(user.roleId).toBe(mockUserData.roleId);
		expect(user.isSuperAdmin).toBe(mockUserData.isSuperAdmin);
		expect(user.allowPermissionsValue).toBe(mockUserData.allowPermissions);
		expect(user.denyPermissionsValue).toBe(mockUserData.denyPermissions);
		expect(user.createdAt).toBe(mockUserData.createdAt);
		expect(user.updatedAt).toBe(mockUserData.updatedAt);
	});

	it("should fail if name is greater than the maximum value", () => {
		const invalidNameProps = { ...mockUserData, name: "a".repeat(61) };
		const result = UserFactory.create(invalidNameProps);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe("Username is limited to 60 characters long");
	});

	it("should fail when allow permission have negative value", () => {
		const invalidPermissionProps = { ...mockUserData, allowPermissions: -1 };
		const result = UserFactory.create(invalidPermissionProps);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe("Permission value must be greater than or equal 0");
	});

	it("should fail when deny permission have negative value", () => {
		const invalidPermissionProps = { ...mockUserData, denyPermissions: -1 };
		const result = UserFactory.create(invalidPermissionProps);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe("Permission value must be greater than or equal 0");
	});
});
