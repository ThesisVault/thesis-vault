export const Roles = {
  GUEST: "GUEST",
  STUDENT: "STUDENT",
  LIBRARIAN: "LIBRARIAN",
  ADMIN: "ADMIN",
} as const;
export type Role = keyof typeof Roles;