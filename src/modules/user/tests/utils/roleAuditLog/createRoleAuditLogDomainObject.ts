import { type IRoleAuditLogRawObject, RoleAuditLogTypes } from "@/modules/user/src/domain/models/roleAuditLog/constant";
import { RoleAuditLogFactory } from "@/modules/user/src/domain/models/roleAuditLog/factory";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

export const createRoleAuditLogDomainObject = ({
	userId = uuid(),
	type = faker.helpers.arrayElement(Object.values(RoleAuditLogTypes)),
	description = faker.lorem.sentence(),
	createdAt = new Date(),
	roleId = uuid(),
}: Partial<IRoleAuditLogRawObject>) => {
	return RoleAuditLogFactory.create({
		userId,
		type,
		description,
		createdAt,
		roleId,
	}).getValue();
};
