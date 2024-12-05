import {
  type IRoleRepository,
  RoleRepository,
} from "@/modules/user/src/repositories/roleRepository";
import type { IRole } from "../../domain/models/role/classes/role";
import type { GetRoleByIdDTO } from "../../dtos/userDTO";

export class GetRoleByIdUseCase {
  private _roleRepository: IRoleRepository;

  public constructor(roleRepository = new RoleRepository()) {
    this._roleRepository = roleRepository;
  }

  public async execute(request: GetRoleByIdDTO): Promise<IRole | null> {
    const role = await this._roleRepository.getRoleById(request.roleId);

    return role;
  }
}
