import type { IRole } from "@/modules/user/src/domain/models/role/classes/role";
import type { GetRoleByIdDTO } from "@/modules/user/src/dtos/userDTO";
import { GetRoleByIdUseCase } from "@/modules/user/src/useCases/role/getRoleByIdUseCase";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetRoleByIdController extends BaseController<
  GetRoleByIdDTO,
  IRole | null
> {
  private _getRoleByIdUseCase: GetRoleByIdUseCase;

  constructor(getRoleByIdUseCase = new GetRoleByIdUseCase()) {
    super();
    this._getRoleByIdUseCase = getRoleByIdUseCase;
  }

  public async executeImpl(request: GetRoleByIdDTO): Promise<IRole | null> {
    const role = await this._getRoleByIdUseCase.execute(request);

    return this.ok(role);
  }
}
