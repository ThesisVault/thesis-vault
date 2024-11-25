import type { IRoleRawObject } from "@/modules/user/src/domain/models/role/constant";
import { RoleFactory } from "@/modules/user/src/domain/models/role/factory";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const createRoleDomainObject = ({
	id = uuid(),
	name = faker.lorem.word(),
	permissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	color = faker.color.rgb(),
	createdAt = faker.date.past(),
	updatedAt = faker.date.past(),
}: Partial<IRoleRawObject>) => {
	return RoleFactory.create({
		id,
		name,
		permissions,
		color,
		createdAt,
		updatedAt,
	}).getValue();
};
