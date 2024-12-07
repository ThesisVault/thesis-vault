import { GetPermissionsUseCase } from "@/modules/user/src/useCases/permission/getPermissionsUseCase";
import { seedUser } from "../../utils/user/seedUser";

describe("GetPermissionsUseCase", () => {
	let getPermissionsUseCase: GetPermissionsUseCase;

	beforeEach(() => {
		getPermissionsUseCase = new GetPermissionsUseCase();
	});

	it("Should return the initial list of permissions", async () => {
		const seededUserWithPermission = await seedUser({ });

		const request = {
			requestedById: seededUserWithPermission.id,
		};

		const result = await getPermissionsUseCase.execute();

		expect(result).toBeDefined();
	});
});
