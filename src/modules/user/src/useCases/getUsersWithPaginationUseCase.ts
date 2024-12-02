import type {
	GetUsersWithPaginationDTO,
	GetUsersWithPaginationResponseDTO,
} from "@/modules/user/src/dtos/userDTO";
import type { IUserRepository } from "@/modules/user/src/repositories/userRepository";

export class GetUsersWithPaginationUseCase {
	private _userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this._userRepository = userRepository;
	}

	public async execute(dto: GetUsersWithPaginationDTO): Promise<GetUsersWithPaginationResponseDTO> {
		const { perPage, page } = dto;

		const skip = (page - 1) * perPage;
		const take = perPage;

		const { users, totalPages } = await this._userRepository.getUsers({ skip, take });

		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		return {
			users,
			hasNextPage,
			hasPreviousPage,
			page,
			totalPages,
		};
	}
}
