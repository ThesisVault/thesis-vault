import type { IUserRawObject } from "@/modules/user/src/domain/models/user/constant";
import { Permissions } from "@/modules/user/src/domain/models/user/shared/permission/permissions";
import { Roles } from "@/modules/user/src/domain/models/user/shared/permission/roles";
import { db } from "@/shared/infrastructure/database";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const seedUser = async ({
	id = uuid(),
	name = faker.person.fullName(),
	email = faker.internet.email(),
	emailVerified = null,
	image = faker.image.url(),
	role = faker.helpers.arrayElement(Object.values(Roles)),
	permissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	createdAt = faker.date.past(),
	updatedAt = faker.date.past(),
}: Partial<IUserRawObject>): Promise<IUserRawObject> => {
	const mockUserData = {
		id,
		name,
		email,
		emailVerified,
		image,
		role,
		permissions,
		createdAt,
		updatedAt,
	};

	return db.user.create({
		data: mockUserData,
	});
};
