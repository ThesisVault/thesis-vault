# Update User Permission UseCase

```mermaid
sequenceDiagram
    participant Client

    box User Module
        participant UpdateUserPermissionController
        participant UserPermissionService
        participant UpdateUserPermissionUseCase
        participant UserRepository
    end

    Client ->> UpdateUserPermissionController: Request to update user's permission <br/> { userId: string, allowPermission: number, denyPermission: number, requestedById: string }
    UpdateUserPermissionController ->> UserPermissionService: hasPermission(userId, "MANAGE_PERMISSION")
    UserPermissionService -->> UpdateUserPermissionController: hasPermission?
    alt user does not have UpdateUser permission
        UpdateUserPermissionController -->> Client: 401 Unauthorized
    end

    UpdateUserPermissionController ->> UpdateUserPermissionUseCase: execute
    UpdateUserPermissionUseCase ->> UserRepository: getUserById(userId)
    UserRepository -->> UpdateUserPermissionUseCase: User

    alt user === null
        UpdateUserPermissionUseCase ->> UpdateUserPermissionController: 404 Not Found
        UpdateUserPermissionController ->> Client: 404 Not Found
    end

    Note over UpdateUserPermissionUseCase: user.updatePermission(permission)
    UpdateUserPermissionUseCase ->> UserRepository: updateUser(user)
    UserRepository -->> UpdateUserPermissionUseCase: updated User
    UpdateUserPermissionUseCase -->> UpdateUserPermissionController: userId
    UpdateUserPermissionController -->> Client: userId
```
