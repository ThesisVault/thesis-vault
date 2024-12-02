import type {
	GetUsersWithPaginationDTO,
	GetUsersWithPaginationResponseDTO,
} from "@/modules/user/src/dtos/userDTO";
import type { GetUsersWithPaginationUseCase } from "@/modules/user/src/useCases/getUsersWithPaginationUseCase";
import { BaseController } from "@/shared/infrastructure/trpc/models/baseController";

export class GetUsersWithPaginationController extends BaseController<
	GetUsersWithPaginationDTO,
	GetUsersWithPaginationResponseDTO
> {
	private _getUsersWithPaginationUseCase: GetUsersWithPaginationUseCase;

	constructor(getUsersWithPaginationUseCase: GetUsersWithPaginationUseCase) {
		super();
		this._getUsersWithPaginationUseCase = getUsersWithPaginationUseCase;
	}

	public async executeImpl(
		request: GetUsersWithPaginationDTO,
	): Promise<GetUsersWithPaginationResponseDTO> {
		const response = await this._getUsersWithPaginationUseCase.execute(request);
		return this.ok(response);
	}
}
