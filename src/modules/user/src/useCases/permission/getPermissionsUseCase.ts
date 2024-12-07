import { PermissionsDetail, type PermissionsDetailType } from "../../shared/permissions";

export class GetPermissionsUseCase {
	public async execute(): Promise<PermissionsDetailType> {
		return PermissionsDetail;
	}
}
