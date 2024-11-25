import { UserName } from "@/modules/user/src/domain/models/user/classes/userName";

describe("UserName", () => {
	it("should create a UserName instance when valid", () => {
		const result = UserName.create("Luis Joshua");

		expect(result.isSuccess).toBe(true);
		expect(result.getValue()).toBeInstanceOf(UserName);
		expect(result.getValue().value).toBe("Luis Joshua");
	});

	it("should fail if username exceeds maximum characters", () => {
		const longName = "a".repeat(61);
		const result = UserName.create(longName);

		expect(result.isFailure).toBe(true);
		expect(result.getErrorMessage()).toBe(
			`Username is limited to ${UserName.MAXIMUM_USERNAME_LENGTH} characters long`,
		);
	});
});
