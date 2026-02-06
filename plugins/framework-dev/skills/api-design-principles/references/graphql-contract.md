# GraphQL Contract Alternative

For GraphQL APIs, document in `api-contracts.md`:

```graphql
# Types
type User {
  id: ID!
  email: String!
  name: String!
  createdAt: DateTime!
}

# Queries
type Query {
  user(id: ID!): User
  users(page: Int, limit: Int): UserConnection!
}

# Mutations
type Mutation {
  createUser(input: CreateUserInput!): UserPayload!
}

# Inputs
input CreateUserInput {
  email: String!
  name: String!
  password: String!
}
```
