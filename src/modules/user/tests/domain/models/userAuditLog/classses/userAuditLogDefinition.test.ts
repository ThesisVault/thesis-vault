import { UserAuditLogDescription } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogDescription";

describe("UserAuditLogDescription", () => {
	it("should create a valid UserAuditLogDescription for a valid description", () => {
		const validDescription = "User created successfully";
		const result = UserAuditLogDescription.create(validDescription);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue().value).toBe(validDescription);
	});

	it("should return failure for a description shorter than 5 characters", () => {
		const invalidDescription = "Log";
		const result = UserAuditLogDescription.create(invalidDescription);

		expect(result.isFailure).toBe(true);
	});

	it("should return failure for an empty description", () => {
		const invalidDescription = "";
		const result = UserAuditLogDescription.create(invalidDescription);

		expect(result.isFailure).toBe(true);
	});
});
