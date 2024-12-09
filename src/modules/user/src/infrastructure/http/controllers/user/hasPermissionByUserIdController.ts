import type { HasPermissionByUserIdDTO } from "@/modules/user/src/dtos/userDTO";
import { HasPermissionByUserIdUseCase } from "@/modules/user/src/useCases/user/hasPermissionByUserIdUseCase";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class HasPermissionByUserIdController extends BaseController<HasPermissionByUserIdDTO, boolean> {
	private _hasPermissionByUserIdUseCase: HasPermissionByUserIdUseCase;

	constructor(hasPermissionByUserIdUseCase = new HasPermissionByUserIdUseCase()) {
		super();
		this._hasPermissionByUserIdUseCase = hasPermissionByUserIdUseCase;
	}

	public async executeImpl(request: HasPermissionByUserIdDTO): Promise<boolean> {
		const hasPermission = await this._hasPermissionByUserIdUseCase.execute(request);

		return this.ok(hasPermission);
	}
}
