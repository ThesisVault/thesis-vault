import type { IAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const createUserAuditLogDomainObject = ({
	id = uuid(),
	userId = uuid(),
	type = faker.lorem.word(),
	description = faker.lorem.sentence(),
	createdAt = faker.date.past(),
}: Partial<IAuditLogRawObject>) => {
	return UserAuditLogFactory.create({
		id,
		userId,
		type,
		description,
		createdAt,
	}).getValue();
};
