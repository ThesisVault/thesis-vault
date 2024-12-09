import { PermissionsDetail } from "@/modules/user/src/shared/permissions";
import { GetPermissionsUseCase } from "@/modules/user/src/useCases/permission/getPermissionsUseCase";

describe("GetPermissionsUseCase", () => {
	let getPermissionsUseCase: GetPermissionsUseCase;

	beforeEach(() => {
		getPermissionsUseCase = new GetPermissionsUseCase();
	});

	it("should return the initial list of permissions", async () => {
		const result = await getPermissionsUseCase.execute();
		expect(result).toBeDefined();
		expect(result).toBe(PermissionsDetail);
	});
});
