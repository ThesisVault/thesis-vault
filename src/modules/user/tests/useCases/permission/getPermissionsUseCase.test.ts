import {
	PermissionsDetail,
	type PermissionsDetailType,
} from "@/modules/user/src/shared/permissions";
import { GetPermissionsUseCase } from "@/modules/user/src/useCases/permission/getPermissionsUseCase";

describe("GetPermissionsUseCase", () => {
	let getPermissionsUseCase: GetPermissionsUseCase;

	beforeEach(() => {
		getPermissionsUseCase = new GetPermissionsUseCase();
	});

	it("Should return the initial list of permissions", async () => {
		const result = await getPermissionsUseCase.execute();
		expect(result).toBeDefined();
		expect(result).toBe(PermissionsDetail);
	});

	it("should return the same instance of PermissionsDetail on each call", async () => {
		const permissions1: PermissionsDetailType = await getPermissionsUseCase.execute();
		const permissions2: PermissionsDetailType = await getPermissionsUseCase.execute();
		expect(permissions1).toBe(permissions2);
	});
});
