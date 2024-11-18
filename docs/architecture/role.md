[//]: # (Changelog: 11/17/2024)

# Deprecating the Hard-Coded Role System

Move away from the hard-coded role system and transitioning to a dynamic role system. Instead of defining roles directly
in the code, we will empower the Super Admin to create and manage roles dynamically.

## Plan

1. Seed a Super Admin role into the system during initialization.
2. The Super Admin will have full permissions across the system, represented as:
    ```typescript

isSuperAdmin = Permission.ALL

  ```
    ```typescript
  // userPermissionService.ts
  public async hasSuperAdmin(userId: string): boolean {} // can bypass everything
  ```

3. The Super Admin can create, update, and delete roles as needed without developer intervention.

## Why is a Dynamic Role System Better?

1. While a hard-coded role system is simple and easy to implement, it limits flexibility. Allowing admins to define
   custom roles provides adaptability for evolving requirements. For instance, if an organization wants a "Moderator"
   role with specific permissions, they can create it without modifying the code.
2. Role permissions can be updated or expanded without touching the source code. This means changes can be made directly
   through the system interface.
3. Permissions can be quickly revoked or reassigned without redeploying the application, improving responsiveness to
   security and operational needs.

## Limitations of the Current Hard-Coded Role System

The current implementation supports only the following roles:

1. Admin
2. Librarian
3. Student
4. Guest

However, this system has limitations:

- Example: A "Professor" or "Instructor" role wasn't added because it shares the same permissions as "Student."
  This duplication seems unnecessary, but it also highlights the inflexibility of the hard-coded system.