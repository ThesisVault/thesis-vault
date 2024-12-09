import type { IUserJSONData } from "@/modules/user/src/domain/models/user/constant";
import type { GetUsersByPaginationDTO } from "@/modules/user/src/dtos/userDTO";
import {
	type IUserRepository,
	UserRepository,
} from "@/modules/user/src/repositories/userRepository";

export interface GetUsersByPaginationResponseDTO {
	users: IUserJSONData[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	page: number;
	totalPages: number;
}

export class GetUsersByPaginationUseCase {
	private _userRepository: IUserRepository;

	constructor(userRepository = new UserRepository()) {
		this._userRepository = userRepository;
	}

	public async execute(dto: GetUsersByPaginationDTO): Promise<GetUsersByPaginationResponseDTO> {
		const { perPage, page, includeDeleted } = dto;

		const users = await this._userRepository.getUsersByPagination(
			{ skip: (page - 1) * perPage, size: perPage },
			{ includeDeleted },
		);

		const totalPages = await this._userRepository.getUsersTotalPages(perPage, includeDeleted);

		return {
			users: users.map((user) => user.toJSON()),
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1,
			page,
			totalPages,
		};
	}
}
