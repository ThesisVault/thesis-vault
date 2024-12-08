import type { HasPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionUseCase } from "@/modules/user/src/useCases/user/hasPermissionUseCase";
import { NotFoundError } from "@/shared/core/errors";
import { seedRole } from "../../utils/role/seedRole";
import { seedUser } from "../../utils/user/seedUser";
describe("HasPermissionUseCase", () => {
	let hasPermissionUseCase: HasPermissionUseCase;

	beforeAll(() => {
		hasPermissionUseCase = new HasPermissionUseCase();
	});

	describe("User Permission", () => {
		it("returns true if the user has a valid permission", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({ roleId: seededRole.id });

			const request: HasPermissionDTO = {
				userId: seededUser.id,
				permission: seededUser.allowPermissions,
				requestedById: seededUser.id,
			};

			const hasPermission = await hasPermissionUseCase.execute(request);

			expect(hasPermission).toBe(true);
		});

		it("should trhow an NotFoundErrro if the is no user", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({ roleId: seededRole.id });

			const request: HasPermissionDTO = {
				userId: "non-exisiting-id",
				permission: seededUser.allowPermissions,
				requestedById: seededUser.id,
			};

			let errorMessage = "";
			try {
				await hasPermissionUseCase.execute(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(NotFoundError);
			}

			expect(errorMessage).toBe(`User with ID ${request.userId} not found`);
		});
	});

	describe("Role Permission", () => {
		it("returns true if the user's role allows the permission", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({ roleId: seededRole.id });

			const request: HasPermissionDTO = {
				userId: seededUser.id,
				permission: seededRole.permissions,
				requestedById: seededUser.id,
			};

			const hasPermission = await hasPermissionUseCase.execute(request);

			expect(hasPermission).toBe(true);
		});

		it("should trhow an NotFoundErrro if the is no user", async () => {
			const seededRole = await seedRole({});
			const seededUser = await seedUser({ roleId: seededRole.id });

			const request: HasPermissionDTO = {
				userId: "non-exisiting-id",
				permission: seededRole.permissions,
				requestedById: seededUser.id,
			};

			let errorMessage = "";
			try {
				await hasPermissionUseCase.execute(request);
			} catch (error) {
				errorMessage = (error as Error).message;

				expect(error).toBeInstanceOf(NotFoundError);
			}

			expect(errorMessage).toBe(`User with ID ${request.userId} not found`);
		});
	});
});
