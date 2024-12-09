import type { IUserAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const seedUserAuditLog = async ({
	id = uuid(),
	userId,
	type = "CREATE",
	description = faker.lorem.sentence(),
	createdAt = new Date(),
}: Partial<IUserAuditLogRawObject>): Promise<IUserAuditLogRawObject> => {
	const user = userId ? { id: userId } : await seedUser({});

	return db.userAuditLog.create({
		data: {
			id,
			userId: user.id,
			type,
			description,
			createdAt,
		},
	});
};
