import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import type { IUserRawObject } from "@/modules/user/src/domain/models/user/shared/constant";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";

const assertUser = (userValue: IUser, expectedUserValue: IUserRawObject) => {
	expect(userValue!.id).toBe(expectedUserValue.id);
	expect(userValue!.nameValue).toBe(expectedUserValue.name);
	expect(userValue!.email).toBe(expectedUserValue.email);
	expect(userValue!.image).toBe(expectedUserValue.image);
	expect(userValue!.roleId).toBe(expectedUserValue.roleId);
	expect(userValue!.allowPermissionsValue).toBe(expectedUserValue.allowPermissions);
	expect(userValue!.denyPermissionsValue).toBe(expectedUserValue.denyPermissions);
};

describe("Test User Repository getUsersByIds", () => {
	let userRepository: IUserRepository;

	beforeAll(async () => {
		userRepository = new UserRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should retrieve a users by Id", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});

		const users = await userRepository.getUsersByIds([seededUserOne.id, seededUserTwo.id]);

		assertUser(users[0], seededUserOne);
		assertUser(users[1], seededUserTwo);
	});

	it("should only retrieve existing roles", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});
		const seededUserIdThree = "non-existing-user-id";

		const users = await userRepository.getUsersByIds([
			seededUserOne.id,
			seededUserTwo.id,
			seededUserIdThree,
		]);

		assertUser(users[0], seededUserOne);
		assertUser(users[1], seededUserTwo);
		expect(users[2]).toBeUndefined();
	});

	it("should retrieve deleted roles when includeDeleted is true", async () => {
		const seededUserOne = await seedUser({});
		const seededUserTwo = await seedUser({});
		const seededUserThree = await seedUser({ isDeleted: true, deletedAt: new Date() });

		const users = await userRepository.getUsersByIds(
			[seededUserOne.id, seededUserTwo.id, seededUserThree.id],
			{ includeDeleted: true },
		);

		assertUser(users[0], seededUserOne);
		assertUser(users[1], seededUserTwo);
		assertUser(users[2], seededUserThree);
	});

	it("should return null when given non-existing user id", async () => {
		const users = await userRepository.getUsersByIds(["non-existing-user-id"]);

		expect(users).toEqual([]);
	});
});
