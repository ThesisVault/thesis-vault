import { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { faker } from "@faker-js/faker";

describe("UserAuditLog", () => {
	const mockAuditLogData = {
		id: faker.string.uuid(),
		userId: faker.string.uuid(),
		type: "CREATE",
		description: faker.lorem.sentence(),
		createdAt: faker.date.past(),
	};

	it("should throw an error if required properties are missing", () => {
		expect(() =>
			UserAuditLog.create({
				id: faker.string.uuid(),
				userId: faker.string.uuid(),
				type: null as unknown as string, // Invalid type
				description: "User logged in",
				createdAt: faker.date.past(),
			}),
		);

		expect(() =>
			UserAuditLog.create({
				id: faker.string.uuid(),
				userId: null as unknown as string, // Invalid userId
				type: "LOGIN",
				description: "User logged in",
				createdAt: faker.date.past(),
			}),
		);

		expect(() =>
			UserAuditLog.create({
				id: faker.string.uuid(),
				userId: faker.string.uuid(),
				type: "LOGIN",
				description: null as unknown as string, // Invalid description
				createdAt: faker.date.past(),
			}),
		);

		expect(() =>
			UserAuditLog.create({
				id: faker.string.uuid(),
				userId: faker.string.uuid(),
				type: "LOGIN",
				description: "User logged in",
				createdAt: null as unknown as Date, // Invalid createdAt
			}),
		);
	});
});
