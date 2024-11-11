# Permission

Permissions in ThesisVault are essential for controlling and managing user capabilities 
within the system. These permissions are configured at the system level based on user 
roles, allowing administrators to grant or restrict specific functionalities. Permissions can also be 
fine-tuned with section-level overwrites to adjust access for certain features or interactions, ensuring a flexible and 
secure user experience.

Permissions in ThesisVault are represented as integer values using bitwise operations to combine and check them. 
Each permission has a unique binary flag, allowing combinations of permissions to be represented efficiently. 
The system calculates total permissions by applying bitwise OR (`|`) operations to combine individual permissions and 
checks specific permissions using the AND (`&`) operation. This ensures precise and efficient permission control, 
facilitating secure and structured user interactions.


The table below outlines the list of available permissions and specifies who each permission applies to.
|        Permission        | Admin | Librarian | Student | Guest |
| ------------------------ | ----- | --------- | ------- | ----- |
| Update User              | ✓     |           |         |       |
| Delete User              | ✓     |           |         |       |
| Manage Permission        | ✓     |           |         |       |
| Update Profile           | ✓     | ✓         | ✓       |       |
| Upload Thesis            |       |           | ✓       |       |
| Modify Thesis            |       | ✓         | ✓       |       |
| Delete Thesis            |       | ✓         | ✓       |       |
| Search Library Resources | ✓     | ✓         | ✓       | ✓     |
| Thesis Review            |       | ✓         |         |       |
| View Thesis Reviews      | ✓     | ✓         | ✓       |       |
| Access Audit Log         | ✓     |           |         |       |


Below is a table of all current permissions, their integer values in hexadecimal, and brief descriptions of 
the privileges that they grant.
|        Permission        |           Bit Value            |                               Description                               |
| ------------------------ | ------------------------------ | ----------------------------------------------------------------------- |
| Update User              | `0x0000000000000001 (1 << 0)`  | Allows modifying other users' information and settings.                 |
| Delete User              | `0x0000000000000002 (1 << 1)`  | Allows removal of user accounts to maintain security and data accuracy. |
| Manage Permission        | `0x0000000000000004 (1 << 2)`  | Allows assigning and modifying user roles and access levels.            |
| Update Profile           | `0x0000000000000008 (1 << 3)`  | Allows users to update their own personal information and settings.     |
| Upload Thesis            | `0x0000000000000016 (1 << 4)`  | Allows submission of theses or academic works to the system.            |
| Modify Thesis            | `0x0000000000000032 (1 << 5)`  | Allows editing or revising submitted theses for necessary updates.      |
| Delete Thesis            | `0x0000000000000064 (1 << 6)`  | Allows deletion of theses to remove outdated or unauthorized content.   |
| Search Library Resources | `0x0000000000000128 (1 << 7)`  | Allows searching and accessing the library's resources.                 |
| Thesis Review            | `0x0000000000000256 (1 << 8)`  | Allows reviewing and providing feedback on submitted theses.            |
| View Thesis Reviews      | `0x0000000000000512 (1 << 9)`  | Allows viewing feedback and reviews on submitted theses.                |
| Access Audit Log         | `0x0000000000001024 (1 << 10)` | Allows viewing system-wide activity logs for monitoring purposes.       |





