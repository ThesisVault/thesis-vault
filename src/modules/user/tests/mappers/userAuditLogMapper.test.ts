import type { IUserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import type { IAuditLogRawObject } from "@/modules/user/src/domain/models/userAuditLog/constant";
import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";
import { UserAuditLogMapper } from "@/modules/user/src/mappers/userAuditLogMapper";
import { faker } from "@faker-js/faker";
import type { Prisma } from "@prisma/client";

describe("UserAuditLogMapper", () => {
	const RawData: IAuditLogRawObject = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: "CREATE",
		description: faker.lorem.sentence(),
		createdAt: faker.date.past(),
	};

	const DomainData: IUserAuditLog = UserAuditLogFactory.create(RawData).getValue();

	it("should map raw data to a domain object", () => {
		const domainObject = UserAuditLogMapper.toDomain(RawData);

		expect(domainObject.id).toBe(RawData.id);
		expect(domainObject.userId).toBe(RawData.userId);
		expect(domainObject.type.value).toBe(RawData.type);
		expect(domainObject.description.value).toBe(RawData.description);
		expect(domainObject.createdAt).toStrictEqual(RawData.createdAt);
	});

	it("should map a domain object to persistence format", () => {
		const persistenceObject = UserAuditLogMapper.toPersistence(DomainData);

		const expectedPersistence: Prisma.UserAuditLogUncheckedCreateInput = {
			id: DomainData.id,
			userId: DomainData.userId,
			type: DomainData.type.value,
			description: DomainData.description.value,
			createdAt: DomainData.createdAt,
		};

		expect(persistenceObject).toEqual(expectedPersistence);
	});
});
