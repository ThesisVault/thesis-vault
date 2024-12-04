import type { IUser } from "@/modules/user/src/domain/models/user/classes/user";
import type { GetUsersWithPaginationDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";

export interface GetUsersWithPaginationResponseDTO {
	users: IUser[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	page: number;
	totalPages: number;
}

export class GetUsersWithPaginationUseCase {
	private _userRepository: IUserRepository;

	constructor(userRepository = new UserRepository()) {
		this._userRepository = userRepository;
	}

	public async execute(dto: GetUsersWithPaginationDTO): Promise<GetUsersWithPaginationResponseDTO> {
		const { perPage, page } = dto;

		const skip = (page - 1) * perPage;

		const users = await this._userRepository.getUsersByPagination({ skip, size: perPage });

		const totalPages = await this._userRepository.getUsersTotalPages(perPage);

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
