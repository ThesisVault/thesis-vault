import { UserFactory } from "@/modules/user/src/domain/models/user/factory";
import type { IUserRawObject } from "@/modules/user/src/domain/models/user/shared/constant";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const createUserDomainObject = ({
	id = uuid(),
	name = faker.person.fullName(),
	email = faker.internet.email(),
	image = faker.image.url(),
	roleId = null,
	isSuperAdmin = false,
	allowPermissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	denyPermissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	isDeleted = false,
	deletedAt = null,
	createdAt = faker.date.past(),
	updatedAt = faker.date.past(),
}: Partial<IUserRawObject>) => {
	return UserFactory.create({
		id,
		name,
		email,
		image,
		roleId,
		isSuperAdmin,
		allowPermissions,
		denyPermissions,
		isDeleted,
		deletedAt,
		createdAt,
		updatedAt,
	}).getValue();
};