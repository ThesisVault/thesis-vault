import { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";
import { faker } from "@faker-js/faker";

describe("UserAuditLogFactory", () => {
	const validUserAuditLogFactoryProps = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: "CREATE",
		description: faker.lorem.sentences(),
		createdAt: faker.date.past(),
	};

	it("should create a valid UserAuditLog", () => {
		const result = UserAuditLogFactory.create(validUserAuditLogFactoryProps);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(UserAuditLog);

		const userAuditLog = result.getValue();
		expect(userAuditLog.id).toBe(validUserAuditLogFactoryProps.id);
		expect(userAuditLog.userId).toBe(validUserAuditLogFactoryProps.userId);
		expect(userAuditLog.type.value).toBe(validUserAuditLogFactoryProps.type);
		expect(userAuditLog.description).toBe(validUserAuditLogFactoryProps.description);
		expect(userAuditLog.createdAt).toBe(validUserAuditLogFactoryProps.createdAt);
	});

	it("should fail if the type is invalid", () => {
		const invalidTypeProps = {
			...validUserAuditLogFactoryProps,
			type: "INVALID_TYPE",
		};

		const result = UserAuditLogFactory.create(invalidTypeProps);

		expect(result.isFailure).toBe(true);
	});
});
