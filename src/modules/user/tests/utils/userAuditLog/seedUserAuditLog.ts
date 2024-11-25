import type { IAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import { db } from "@/shared/infrastructure/database";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";

export const seedUserAuditLog = async ({
	id = uuid(),
	userId,
	type = "LOGIN",
	description = "User logged in successfully",
	createdAt = faker.date.past(),
}: Partial<IAuditLogRawObject>): Promise<IAuditLogRawObject> => {
	try {
		const user = userId ? { id: userId } : await seedUser({});

		console.log("Seeding with userId:", user.id);

		const auditLog = await db.userAuditLog.create({
			data: {
				id,
				userId: user.id,
				type,
				description,
				createdAt,
			},
		});

		return auditLog;
	} catch (error) {
		console.error("Error seeding user audit log:", error);
		throw new Error("Failed to seed user audit log");
	}
};
