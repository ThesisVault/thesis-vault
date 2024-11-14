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

| Permission              | Admin | Librarian | Student | Guest |
|-------------------------|-------|-----------|---------|-------|
| Search Resources        |       |           | ✓       | ✓     |
| View Resources          |       |           | ✓       | ✓     |
| Upload Thesis           | ✓     |           | ✓       |       |
| View Submitted Thesis   | ✓     | ✓         | ✓       |       |
| Modify Thesis           |       |           | ✓       |       |
| Manage Submitted Theses |       | ✓         |         |       |
| Delete Thesis           |       | ✓         |         |       |
| View User Audit Log     | ✓     | ✓         |         |       |
| View Thesis Audit Log   |       | ✓         |         |       |
| Update User             | ✓     | ✓         |         |       |
| Delete User             | ✓     |           |         |       |
| Manage Permission       |       |           |         |       |


Below is a table of all current permissions, their integer values in hexadecimal, and brief descriptions of 
the privileges that they grant.

| Permission              | Bit Value                        | Description                                                  |
|-------------------------|----------------------------------|--------------------------------------------------------------|
| Search Resources        | `0x0000000000000001` `(1 << 0)`  | Allows searching resources in the system.                    |
| View Resources          | `0x0000000000000002` `(1 << 1)`  | Allows viewing available resources in the system.            |
| Upload Thesis           | `0x0000000000000004` `(1 << 2)`  | Allows uploading theses for review.                          |
| View Submitted Thesis   | `0x0000000000000008` `(1 << 3)`  | Allows viewing submitted theses for review.                  |
| Modify Thesis           | `0x0000000000000010` `(1 << 4)`  | Allows modifying uploaded theses.                            |
| Manage Submitted Theses | `0x0000000000000020` `(1 << 5)`  | Allows approving or denying submitted/uploaded theses.       |
| Delete Thesis           | `0x0000000000000040` `(1 << 6)`  | Allows deleting theses.                                      |
| View User Audit Log     | `0x0000000000000080` `(1 << 7)`  | Allows viewing account edit history.                         |
| View Thesis Audit Log   | `0x0000000000000100` `(1 << 8)`  | Allows viewing the thesis audit log.                         |
| Update User             | `0x0000000000000200` `(1 << 9)`  | Allows updating user details.                                |
| Delete User             | `0x0000000000000400` `(1 << 10)` | Allows deleting users.                                       |
| Manage Permission       | `0x0000000000000800` `(1 << 11)` | Allows granting or revoking permissions and roles for users. |
