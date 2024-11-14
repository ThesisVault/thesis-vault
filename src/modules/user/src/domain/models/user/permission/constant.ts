/**
 * Enum representing various User permissions in the system.
 * Each permission corresponds to a specific user action.
 */
export enum PermissionsBits {
  /**
   * Search resources in the system
   */
  SEARCH_RESOURCES = 1 << 0,
  
  /**
   * View available resources in the system
   */
  VIEW_RESOURCES = 1 << 1,
  
  /**
   * Upload Thesis for review.
   */
  UPLOAD_THESIS = 1 << 2,
  
  /**
   * View submitted theses for review
   */
  VIEW_SUBMITTED_THESIS = 1 << 3,
  
  /**
   * Modify uploaded thesis.
   */
  MODIFY_THESIS = 1 << 4,
  
  /**
   * Approve or Deny submitted/uploaded Theses
   */
  MANAGE_SUBMITTED_THESES = 1 << 5,
  
  /**
   * Delete Thesis
   */
  DELETE_THESIS = 1 << 6,
  
  /**
   * View account edit history.
   */
  VIEW_USER_AUDIT_LOG = 1 << 7,
  
  /**
   * View Thesis Audit Log
   */
  VIEW_THESIS_AUDIT_LOG = 1 << 8,
  
  /**
   * Update user details
   * */
  UPDATE_USER = 1 << 9,
  
  /**
   * Delete User from db
   */
  DELETE_USER = 1 << 10,
  
  /**
   * Change User Permission or Role.
   */
  MANAGE_PERMISSION = 1 << 11,
  
  // UPDATE THIS WHENEVER YOU ADD NEW PERMISSION
  ALL = (1 << 12) - 1
}

export enum Permissions {
  SEARCH_RESOURCES = "SEARCH_RESOURCES",
  VIEW_RESOURCES = "VIEW_RESOURCES",
  UPLOAD_THESIS = "UPLOAD_THESIS",
  VIEW_SUBMITTED_THESIS = "VIEW_SUBMITTED_THESIS",
  MODIFY_THESIS = "MODIFY_THESIS",
  MANAGE_SUBMITTED_THESES = "MANAGE_SUBMITTED_THESES",
  DELETE_THESIS = "DELETE_THESIS",
  VIEW_USER_AUDIT_LOG = "VIEW_USER_AUDIT_LOG",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
  MANAGE_PERMISSION = "MANAGE_PERMISSION",
}

/**
 * Combined User permissions in the system.
 */
export enum RolesPermissionBits {
  /**
   * -- GUEST ROLE
   * Permissions:
   * SEARCH_RESOURCES
   * VIEW_RESOURCES
   */
  GUEST =
    // biome-ignore lint/style/useLiteralEnumMembers: <explanation>
    PermissionsBits.SEARCH_RESOURCES
    | PermissionsBits.VIEW_RESOURCES,
  
  /**
   * -- STUDENT ROLE
   * Permissions:
   * UPLOAD_THESIS
   * VIEW_SUBMITTED_THESIS
   * MODIFY_THESIS
   */
  STUDENT =
    // biome-ignore lint/style/useLiteralEnumMembers: <explanation>
    PermissionsBits.UPLOAD_THESIS
    | PermissionsBits.VIEW_SUBMITTED_THESIS
    | PermissionsBits.MODIFY_THESIS
    | PermissionsBits.SEARCH_RESOURCES
    | PermissionsBits.VIEW_RESOURCES
  ,
  
  /**
   * -- LIBRARIAN ROLE
   * Permissions:
   * DELETE_THESIS
   * VIEW_SUBMITTED_THESIS
   * MANAGE_SUBMITTED_THESES
   * VIEW_THESIS_AUDIT_LOG
   */
  LIBRARIAN =
    // biome-ignore lint/style/useLiteralEnumMembers: <explanation>
    PermissionsBits.DELETE_THESIS
    | PermissionsBits.VIEW_SUBMITTED_THESIS
    | PermissionsBits.MANAGE_SUBMITTED_THESES
    | PermissionsBits.VIEW_THESIS_AUDIT_LOG
    | PermissionsBits.SEARCH_RESOURCES
    | PermissionsBits.VIEW_RESOURCES
  ,
  
  /**
   * -- ADMIN ROLE
   * Permissions:
   * UPDATE_USER,
   * DELETE_USER,
   * MANAGE_PERMISSION,
   * VIEW_USER_AUDIT_LOG
   * */
  ADMIN =
    // biome-ignore lint/style/useLiteralEnumMembers: <explanation>
    PermissionsBits.UPDATE_USER
    | PermissionsBits.DELETE_USER
    | PermissionsBits.MANAGE_PERMISSION
    | PermissionsBits.VIEW_USER_AUDIT_LOG
    | PermissionsBits.SEARCH_RESOURCES
    | PermissionsBits.VIEW_RESOURCES
  ,
}

export enum Roles {
  GUEST = "GUEST",
  STUDENT = "STUDENT",
  LIBRARIAN = "LIBRARIAN",
  ADMIN = "ADMIN",
}
