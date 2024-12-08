import type { IRoleRawObject } from "@/modules/user/src/domain/models/role/constant";
import { Permissions } from "@/modules/user/src/shared/permissions";
import { db } from "@/shared/infrastructure/database";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const seedRole = async ({
	id = uuid(),
	name = faker.lorem.word(),
	permissions = faker.number.int({ min: 0, max: Permissions.ALL, multipleOf: 2 }),
	color = faker.color.rgb(),
	createdAt = faker.date.past(),
	updatedAt = faker.date.past(),
	isDeleted = false,
	deletedAt = null,
}: Partial<IRoleRawObject>): Promise<IRoleRawObject> => {
	return db.role.create({
		data: {
			id,
			name,
			permissions,
			color,
			createdAt,
			updatedAt,
			isDeleted,
			deletedAt,
		},
	});
};
