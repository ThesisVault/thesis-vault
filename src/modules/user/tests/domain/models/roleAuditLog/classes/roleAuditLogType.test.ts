import { RoleAuditLogType } from "@/modules/user/src/domain/models/roleAuditLog/classes/roleAuditLogType";
import { RoleAuditLogTypes } from "@/modules/user/src/domain/models/roleAuditLog/constant";
import { faker } from "@faker-js/faker";

describe("RoleAuditLogType", () => {
	it("should create a valid RoleAuditLogType for a valid type", () => {
		const validType = faker.helpers.arrayElement(Object.values(RoleAuditLogTypes));
		const result = RoleAuditLogType.create(validType);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue().value).toBe(validType);
	});

	it("should return failure for an invalid UserAuditLogType", () => {
		const invalidType = "INVALID_TYPE";
		const result = RoleAuditLogType.create(invalidType);

		expect(result.isFailure).toBe(true);
	});
});
