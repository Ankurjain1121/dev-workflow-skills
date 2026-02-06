# Architecture Pattern Examples

## Hexagonal Architecture Structure

```
src/
├── domain/                 # Core business logic
│   ├── entities/
│   │   └── User.ts
│   ├── services/
│   │   └── UserService.ts
│   └── ports/              # Interfaces
│       ├── UserRepository.ts
│       └── NotificationService.ts
├── adapters/
│   ├── primary/            # Driving adapters
│   │   ├── rest/
│   │   │   └── UserController.ts
│   │   └── cli/
│   └── secondary/          # Driven adapters
│       ├── persistence/
│       │   └── PostgresUserRepository.ts
│       └── notification/
│           └── EmailNotificationService.ts
└── config/
    └── dependencies.ts     # Dependency injection
```

## Hexagonal Architecture Diagram

```
                    ┌─────────────────┐
                    │   REST API      │
                    │   (Adapter)     │
                    └────────┬────────┘
                             │
┌─────────────┐    ┌─────────▼─────────┐    ┌─────────────┐
│   CLI       │◄───│                   │───►│  PostgreSQL │
│ (Adapter)   │    │   DOMAIN CORE     │    │  (Adapter)  │
└─────────────┘    │                   │    └─────────────┘
                   │   (Business       │
┌─────────────┐    │    Logic)         │    ┌─────────────┐
│  Message    │◄───│                   │───►│   Redis     │
│  Queue      │    │   [Ports define   │    │  (Adapter)  │
│ (Adapter)   │    │    interfaces]    │    └─────────────┘
└─────────────┘    └───────────────────┘
```

## Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│              Frameworks & Drivers           │
│   (Web, DB, External Interfaces)            │
│  ┌───────────────────────────────────────┐  │
│  │         Interface Adapters            │  │
│  │   (Controllers, Presenters, Gateways) │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │      Application Business       │  │  │
│  │  │         (Use Cases)             │  │  │
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │   Enterprise Business     │  │  │  │
│  │  │  │      (Entities)           │  │  │  │
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

Dependencies point INWARD only.
```

## Modular Monolith Structure

```
┌────────────────────────────────────────┐
│           Single Deployable            │
│  ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │  Users   │ │  Orders  │ │Payment │  │
│  │  Module  │ │  Module  │ │ Module │  │
│  │          │ │          │ │        │  │
│  │ ┌──────┐ │ │ ┌──────┐ │ │┌──────┐│  │
│  │ │Domain│ │ │ │Domain│ │ ││Domain││  │
│  │ └──────┘ │ │ └──────┘ │ │└──────┘│  │
│  │ ┌──────┐ │ │ ┌──────┐ │ │┌──────┐│  │
│  │ │ API  │ │ │ │ API  │ │ ││ API  ││  │
│  │ └──────┘ │ │ └──────┘ │ │└──────┘│  │
│  └──────────┘ └──────────┘ └────────┘  │
│                                        │
│           Shared Infrastructure        │
└────────────────────────────────────────┘
```
