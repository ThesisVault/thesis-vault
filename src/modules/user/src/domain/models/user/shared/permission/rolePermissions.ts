import { Permissions } from "@/modules/user/src/domain/models/user/shared/permission/permissions";

export const RolesPermissions = {
	/**
	 * -- GUEST ROLE
	 * Permissions:
	 * |- SEARCH_RESOURCES
	 * |- VIEW_RESOURCES
	 */
	GUEST: Permissions.SEARCH_RESOURCES | Permissions.VIEW_RESOURCES,

	/**
	 * -- STUDENT ROLE
	 * Permissions:
	 * |- SEARCH_RESOURCES
	 * |- VIEW_RESOURCES
	 * |- UPLOAD_THESIS
	 * |- VIEW_SUBMITTED_THESIS
	 * |- MODIFY_THESIS
	 */
	STUDENT:
		Permissions.SEARCH_RESOURCES |
		Permissions.VIEW_RESOURCES |
		Permissions.UPLOAD_THESIS |
		Permissions.VIEW_SUBMITTED_THESIS |
		Permissions.MODIFY_THESIS,

	/**
	 * -- LIBRARIAN ROLE
	 * Permissions:
	 * |- DELETE_THESIS
	 * |- VIEW_SUBMITTED_THESIS
	 * |- MANAGE_SUBMITTED_THESES
	 * |- VIEW_THESIS_AUDIT_LOG
	 */
	LIBRARIAN:
		Permissions.DELETE_THESIS |
		Permissions.VIEW_SUBMITTED_THESIS |
		Permissions.MANAGE_SUBMITTED_THESES |
		Permissions.VIEW_THESIS_AUDIT_LOG |
		Permissions.SEARCH_RESOURCES |
		Permissions.VIEW_RESOURCES,

	/**
	 * -- ADMIN ROLE
	 * Permissions:
	 * |- UPDATE_USER,
	 * |- DELETE_USER,
	 * |- MANAGE_PERMISSION,
	 * |- VIEW_USER_AUDIT_LOG
	 * */
	ADMIN:
		Permissions.UPDATE_USER |
		Permissions.DELETE_USER |
		Permissions.MANAGE_PERMISSION |
		Permissions.VIEW_USER_AUDIT_LOG |
		Permissions.SEARCH_RESOURCES |
		Permissions.VIEW_RESOURCES,
} as const;
