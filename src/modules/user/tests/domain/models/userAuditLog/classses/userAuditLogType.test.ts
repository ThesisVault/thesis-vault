import { UserAuditLogType } from "@/modules/user/src/domain/models/userAuditLog/classes/userAuditLogType";

describe("UserAuditLogType", () => {
	it("should create a valid UserAuditLogType for a valid type", () => {
		const validType = "CREATE";
		const result = UserAuditLogType.create(validType);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue().value).toBe(validType);
	});

	it("should return failure for an invalid UserAuditLogType", () => {
		const invalidType = "INVALID_TYPE";
		const result = UserAuditLogType.create(invalidType);

		expect(result.isFailure).toBe(true);
	});
});
