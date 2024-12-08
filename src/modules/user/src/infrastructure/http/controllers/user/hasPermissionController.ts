import type { HasPermissionDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionUseCase } from "@/modules/user/src/useCases/user/hasPermissionUseCase";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class HasPermissionController extends BaseController<HasPermissionDTO, boolean> {
	private _hasPermissionUseCase: HasPermissionUseCase;

	constructor(hasPermissionUseCase = new HasPermissionUseCase()) {
		super();
		this._hasPermissionUseCase = hasPermissionUseCase;
	}

	public async executeImpl(request: HasPermissionDTO): Promise<boolean> {
		const hasPermission = await this._hasPermissionUseCase.execute(request);

		return this.ok(hasPermission);
	}
}
