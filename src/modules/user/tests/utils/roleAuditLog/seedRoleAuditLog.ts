import type {
	IRoleAuditLogRawObject,
	IRoleAuditLogSchemaObject,
} from "@/modules/user/src/domain/models/roleAuditLog/constant";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const seedRoleAuditLog = async ({
	id = uuid(),
	userId,
	type = "CREATE",
	description = faker.lorem.sentence(),
	createdAt = faker.date.past(),
	roleId,
}: Partial<IRoleAuditLogSchemaObject>): Promise<IRoleAuditLogRawObject> => {
	const user = userId ? { id: userId } : await seedUser({});
	const role = roleId ? { id: roleId } : await seedRole({});

	return db.roleAuditLog.create({
		data: {
			id,
			userId: user.id,
			type,
			description,
			createdAt,
			roleId: role.id,
		},
	});
};
