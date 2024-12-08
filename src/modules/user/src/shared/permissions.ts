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
	MANAGE_USER: 1 << 12,
	MANAGE_ROLE: 1 << 13,

	// ! UPDATE THIS WHENEVER YOU ADD NEW PERMISSION
	ALL: (1 << 14) - 1,
} as const;

export const PermissionsDetail = {
	SEARCH_RESOURCES: {
		name: "Search Resources",
		desciption: "Allows searching resources in the system.",
		value: Permissions.SEARCH_RESOURCES,
	},
	VIEW_RESOURCES: {
		name: "View Resources",
		description: "Allows viewing available resources in the system.",
		value: Permissions.VIEW_RESOURCES,
	},
	UPLOAD_THESIS: {
		name: "Upload Thesis",
		description: "Allows uploading theses for review.",
		value: Permissions.UPLOAD_THESIS,
	},
	VIEW_SUBMITTED_THESIS: {
		name: "View Submitted Thesis",
		description: "Allows viewing submitted theses for review.",
		value: Permissions.VIEW_SUBMITTED_THESIS,
	},
	MODIFY_THESIS: {
		name: "Modify Thesis",
		description: "Allows modifying uploaded theses.",
		value: Permissions.MODIFY_THESIS,
	},
	MANAGE_SUBMITTED_THESES: {
		name: "Manage Submitted Theses",
		description: "Allows approving or denying submitted/uploaded theses.",
		value: Permissions.MANAGE_SUBMITTED_THESES,
	},
	DELETE_THESIS: {
		name: "Delete Thesis",
		description: "Allows deleting theses.",
		value: Permissions.DELETE_THESIS,
	},
	VIEW_USER_AUDIT_LOG: {
		name: "View User Audit Log",
		description: "Allows viewing account edit history.",
		value: Permissions.VIEW_USER_AUDIT_LOG,
	},
	VIEW_THESIS_AUDIT_LOG: {
		name: "View Thesis Audit Log",
		description: "Allows viewing the thesis audit log.",
		value: Permissions.VIEW_THESIS_AUDIT_LOG,
	},
	UPDATE_USER: {
		name: "Update User",
		description: "Allows updating user details.",
		value: Permissions.UPDATE_USER,
	},
	DELETE_USER: {
		name: "Delete User",
		description: "Allows deleting users.",
		value: Permissions.DELETE_USER,
	},
	MANAGE_PERMISSION: {
		name: "Manage Permission",
		description: "Allows granting or revoking permissions and roles for users.",
		value: Permissions.MANAGE_PERMISSION,
	},
	MANAGE_USER: {
		name: "Manage User",
		description: "Allows managing user.",
		value: Permissions.MANAGE_USER,
	},
	MANAGE_ROLE: {
		name: "Manage Role",
		description: "Allows managing roles",
		value: Permissions.MANAGE_ROLE,
	},

	ALL: {
		name: "All",
		description: "Allows one to do all",
		value: Permissions.ALL,
	},
} as const;

export type PermissionKeys = keyof typeof Permissions;
export type PermissionsDetailType = typeof PermissionsDetail;
