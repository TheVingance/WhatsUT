# WhatsUT UML Diagrams

## Use Case Diagram

```mermaid
usecaseDiagram
    actor User
    actor Admin
    
    User <|-- Admin

    package System {
        usecase "Register/Login" as UC1
        usecase "View Online Users" as UC2
        usecase "Create Group" as UC3
        usecase "Join Group" as UC4
        usecase "Private Chat" as UC5
        usecase "Group Chat" as UC6
        usecase "Send File" as UC7
        usecase "Leave Group" as UC8
        usecase "Ban User" as UC9
    }

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    Admin --> UC9
```

## Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string username
        +string password
        +boolean is_admin
        +boolean is_banned
        +register()
        +login()
    }

    class Group {
        +int id
        +string name
        +int admin_id
        +addMember()
        +removeMember()
    }

    class Message {
        +int id
        +int sender_id
        +int receiver_id
        +int group_id
        +string content
        +string file_path
        +datetime timestamp
    }

    class Server {
        +initSocket()
        +handleConnection()
        +handleMessage()
    }

    User "1" -- "*" Message : sends
    User "1" -- "*" Group : creates
    Group "1" -- "*" Message : contains
    User "*" -- "*" Group : member_of
```

## Sequence Diagram: Send Private Message

```mermaid
sequenceDiagram
    participant Sender
    participant Client
    participant Server
    participant Database
    participant Receiver

    Sender->>Client: Types message & clicks Send
    Client->>Server: emit('send_message', {senderId, receiverId, content})
    Server->>Database: INSERT INTO messages...
    Database-->>Server: Success (ID)
    Server->>Receiver: emit('receive_message', message)
    Server->>Client: emit('receive_message', message) (Ack)
    Receiver->>Receiver: Display Message
    Client->>Client: Display Message
```

## Sequence Diagram: Group Creation & Join

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant Database

    User->>Server: POST /groups {name}
    Server->>Database: INSERT INTO groups...
    Database-->>Server: Success (ID)
    Server->>Database: INSERT INTO group_members (admin)
    Server-->>User: Group Created

    User->>Server: POST /groups/:id/join
    Server->>Database: INSERT INTO group_members (pending)
    Server-->>User: Request Sent
```
