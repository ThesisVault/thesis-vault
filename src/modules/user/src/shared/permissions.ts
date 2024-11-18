/**
 * Enum representing various User permissions in the system.
 * Each permission corresponds to a specific user action.
 * @see docs/permission.md
 */
export const Permissions = {
	SEARCH_RESOURCES: 1 << 0,
	VIEW_RESOURCES: 1 << 1,
	UPLOAD_THESIS: 1 << 2,
	VIEW_SUBMITTED_THESIS: 1 << 3,
	MODIFY_THESIS: 1 << 4,
	MANAGE_SUBMITTED_THESES: 1 << 5,
	DELETE_THESIS: 1 << 6,
	VIEW_USER_AUDIT_LOG: 1 << 7,
	VIEW_THESIS_AUDIT_LOG: 1 << 8,
	UPDATE_USER: 1 << 9,
	DELETE_USER: 1 << 10,
	MANAGE_PERMISSION: 1 << 11,

	// ! UPDATE THIS WHENEVER YOU ADD NEW PERMISSION
	ALL: (1 << 12) - 1,
} as const;

export type PermissionKeys = keyof typeof Permissions;
