# Get Users With Pagination Use Case

```mermaid
sequenceDiagram
    participant Client

    participant GetUsersWithPaginationController
    participant GetUsersWithPaginationUseCase
    participant UserRepository

    Client->>GetUsersWithPaginationController: Sends { perPage, page }
    GetUsersWithPaginationController->>GetUsersWithPaginationUseCase: Calls execute({ perPage, page })
    GetUsersWithPaginationUseCase->>UserRepository: Queries with { skip: (page-1)*perPage, take: perPage }
    UserRepository-->>GetUsersWithPaginationUseCase: Returns { users, totalPages }
    GetUsersWithPaginationUseCase->>GetUsersWithPaginationController: Returns { users, hasNextPage, page, totalPages }
    GetUsersWithPaginationController->>Client: Sends { users, hasNextPage, page, totalPages }
```
