import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import type { IUserRawObject } from "@/modules/user/src/domain/models/user/constant";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

const assertUser = (user: IUser, expectedUserValue: IUserRawObject) => {
	expect(user!.id).toBe(expectedUserValue.id);
	expect(user!.nameValue).toBe(expectedUserValue.name);
	expect(user!.email).toBe(expectedUserValue.email);
	expect(user!.image).toBe(expectedUserValue.image);
	expect(user!.roleId).toBe(expectedUserValue.roleId);
	expect(user!.allowPermissionsValue).toBe(expectedUserValue.allowPermissions);
	expect(user!.denyPermissionsValue).toBe(expectedUserValue.denyPermissions);
};

describe("Test User Repository getUserById", () => {
	let userRepository: IUserRepository;

	beforeAll(async () => {
		userRepository = new UserRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve existing user found by Id", async () => {
		const seededUser = await seedUser({});

		const user = await userRepository.getUserById(seededUser.id);

		assertUser(user!, seededUser);
	});

	it("should retrieve deleted user when includeDeleted is true", async () => {
		const seededUser = await seedUser({ isDeleted: true, deletedAt: new Date() });

		const user = await userRepository.getUserById(seededUser.id, { includeDeleted: true });

		assertUser(user!, seededUser);
	});

	it("should return null when given non-existing user id", async () => {
		const user = await userRepository.getUserById("not-a-user-id");

		expect(user).toBeNull();
	});
});
