import { UserAuditLogFactory } from "@/modules/user/src/domain/models/userAuditLog/factory";
import { UserAuditLog } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLog";
import { faker } from "@faker-js/faker";

describe("UserAuditLogFactory", () => {
	let mockUserAuditLogData: {
		id: string;
		userId: string;
		type: string;
		description: string;
		createdAt: Date;
	};

	beforeEach(() => {
		mockUserAuditLogData = {
			id: faker.string.uuid(),
			userId: faker.string.uuid(),
			type: "LOGIN",
			description: "User logged in successfully",
			createdAt: faker.date.past(),
		};
	});

	it("should successfully create a UserAuditLog when all properties are valid", () => {
		const result = UserAuditLogFactory.create(mockUserAuditLogData);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(UserAuditLog);

		const userAuditLog = result.getValue();
		expect(userAuditLog.id).toBe(mockUserAuditLogData.id);
		expect(userAuditLog.userId).toBe(mockUserAuditLogData.userId);
		expect(userAuditLog.type).toBe(mockUserAuditLogData.type);
		expect(userAuditLog.description).toBe(mockUserAuditLogData.description);
		expect(userAuditLog.createdAt).toBe(mockUserAuditLogData.createdAt);
	});

	it("should fail if 'type' is invalid", () => {
		const invalidData = { ...mockUserAuditLogData, type: null as unknown as string };
		const result = UserAuditLogFactory.create(invalidData);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe("type is required.");
	});

	it("should fail if 'description' is empty", () => {
		const invalidData = { ...mockUserAuditLogData, description: "" };
		const result = UserAuditLogFactory.create(invalidData);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe("description is required.");
	});

	it("should fail if 'createdAt' is not a valid Date", () => {
		const invalidData = { ...mockUserAuditLogData, createdAt: "invalidDate" as unknown as Date };
		const result = UserAuditLogFactory.create(invalidData);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe("createdAt must be a valid Date.");
	});
});
