import type { HasPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionUseCase } from "@/modules/user/src/useCases/userPermissionService/hasPermissionUseCase";
import { seedRole } from "../../utils/role/seedRole";
import { seedUser } from "../../utils/user/seedUser";

describe("HasPermissionUseCase", () => {
	let hasPermissionUserCase: HasPermissionUseCase;

	beforeAll(() => {
		hasPermissionUserCase = new HasPermissionUseCase();
	});

	it("returns true if the user has a valid permission", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});

		const request: HasPermissionDTO = {
			userId: seededUser.id,
			permission: seededRole.permissions,
			requestedById: seededUser.id,
		};

		const hasPermission = await hasPermissionUserCase.execute(request);

		expect(hasPermission).toBe(true);
	});

	it("return false if there is no user", async () => {
		const seededUser = await seedUser({});
		const seededRole = await seedRole({});

		const request: HasPermissionDTO = {
			userId: "",
			permission: seededRole.permissions,
			requestedById: seededUser.id,
		};

		const hasPermission = await hasPermissionUserCase.execute(request);

		expect(hasPermission).toBe(false);
	});
});
