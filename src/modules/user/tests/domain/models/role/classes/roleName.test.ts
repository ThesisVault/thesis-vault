import { RoleName } from "@/modules/user/src/domain/models/role/classes/roleName";
import { faker } from "@faker-js/faker";

describe("RoleName", () => {
	it("should create a RoleName instance when valid", () => {
		const roleName = faker.lorem.word();
		const result = RoleName.create(roleName);

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(RoleName);
		expect(result.getValue().value).toBe(roleName);
	});

	it("should fail if role name exceeds maximum characters", () => {
		const longName = "a".repeat(21);
		const result = RoleName.create(longName);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe(
			`Role name is limited to ${RoleName.MAXIMUM_ROLE_NAME_LENGTH} characters long`,
		);
	});
});
