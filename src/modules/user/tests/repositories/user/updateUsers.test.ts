import { Permissions } from "@/modules/user/src/shared/permissions";
import { db } from "@/shared/infrastructure/database";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { UserMapper } from "@/modules/user/src/mappers/userMapper";
import { type IUserRepository, UserRepository } from "@/modules/user/src/repositories/userRepository";
import { createUserDomainObject } from "@/modules/user/tests/utils/user/createUserDomainObject";
import { faker } from "@faker-js/faker";

describe("UserRepository.updateUsers", () => {
	let userRepository: IUserRepository;

	beforeAll(async () => {
		userRepository = new UserRepository();
	});

	afterAll(async () => {
		await db.$disconnect();
	});

	it("should update multiple user with different properties", async () => {
        const seededRole = await seedRole({});
        const seededUser = await seedUser({});
        const domainUser = UserMapper.toDomain({
            ...seededUser,
            name: faker.person.fullName(),
            allowPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
            denyPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
            roleId: seededRole.id
        });
  
        const seededUserTwo = await seedUser({});
        const domainUserTwo = UserMapper.toDomain({
            ...seededUserTwo,
            name: faker.person.fullName(),
            allowPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
            denyPermissions: faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
            roleId: seededRole.id
        });

        const updatedUsers = await userRepository.updateUsers([domainUser, domainUserTwo]);
  
        expect(updatedUsers.length).toBe(2);
        expect(updatedUsers[0].nameValue).toBe(domainUser.nameValue);
        expect(updatedUsers[0].allowPermissionsValue).toBe(domainUser.allowPermissionsValue);
        expect(updatedUsers[0].denyPermissionsValue).toBe(domainUser.denyPermissionsValue);
        expect(updatedUsers[0].roleId).toBe(domainUser.roleId);
        expect(updatedUsers[1].nameValue).toBe(domainUserTwo.nameValue);
        expect(updatedUsers[1].allowPermissionsValue).toBe(domainUserTwo.allowPermissionsValue);
        expect(updatedUsers[1].denyPermissionsValue).toBe(domainUserTwo.denyPermissionsValue);
        expect(updatedUsers[1].roleId).toBe(domainUserTwo.roleId);
    });

	it("should return empty array when updating multiple user and 1 failed", async () => {
		const seededUser = await seedUser({});
		const nonExistingUser = createUserDomainObject({});

		const user = await userRepository.updateUsers([
			UserMapper.toDomain({
				...seededUser,
				name: "Luis Joshua",
			}),
			nonExistingUser,
		]);

		expect(user.length).toBe(0);
	});
});
