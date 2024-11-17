import { UserFactory } from "@/modules/user/src/domain/models/user/factory";
import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";
import { Roles } from "@/modules/user/src/domain/models/user/shared/permission/roles";
import { Permissions } from "@/modules/user/src/domain/models/user/shared/permission/permissions";
import type { IUserRawObject } from "@/modules/user/src/domain/models/user/constant";

export const createUserDomainObject = ({
	id = uuid(),
	name = faker.person.fullName(),
	email = faker.internet.email(),
	image = faker.image.url(),
	role = faker.helpers.arrayElement(Object.values(Roles)),
	permissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	createdAt = faker.date.past(),
	updatedAt = faker.date.past(),
}: Partial<IUserRawObject>) => {
	return UserFactory.create({
		id,
		name,
		email,
		image,
		role,
		permissions,
		createdAt,
		updatedAt,
	}).getValue();
};
