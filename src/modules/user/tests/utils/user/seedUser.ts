import type { IUserRawObject } from "@/modules/user/src/domain/models/user/constant";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { db } from "@/shared/infrastructure/database";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const seedUser = async ({
	id = uuid(),
	name = faker.person.fullName(),
	email = faker.internet.email(),
	emailVerified = null,
	image = faker.image.url(),
	roleId = null,
	isSuperAdmin = false,
	allowPermissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	denyPermissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	isDeleted = false,
	deletedAt = null,
	createdAt = faker.date.past(),
	updatedAt = faker.date.past(),
}: Partial<IUserRawObject>): Promise<IUserRawObject> => {
	return db.user.create({
		data: {
			id,
			name,
			email,
			emailVerified,
			image,
			roleId,
			isSuperAdmin,
			allowPermissions,
			denyPermissions,
			isDeleted,
			deletedAt,
			createdAt,
			updatedAt,
		},
	});
};
