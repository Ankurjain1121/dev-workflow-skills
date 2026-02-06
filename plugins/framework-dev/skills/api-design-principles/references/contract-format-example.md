# API Contract File Format

Create `03-api-planning/api-contracts.md` with this structure:

```markdown
# API Contracts

> ⚠️ **THIS FILE IS THE SOURCE OF TRUTH**
> Before implementing or calling any endpoint, read this file.
> Do not guess endpoints. Do not assume paths.

## Base Configuration
- Base URL: `/api/v1`
- Auth: Bearer token in `Authorization` header
- Content-Type: `application/json`
- All dates: ISO 8601 UTC

## Endpoints Index

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| GET | /users | List all users | ✅ Implemented |
| POST | /users | Create user | ✅ Implemented |
| GET | /users/:id | Get user by ID | 🔄 In Progress |
| PUT | /users/:id | Update user | ⏳ Pending |
| DELETE | /users/:id | Delete user | ⏳ Pending |

---

## Endpoint Details

### GET /users

**Description:** List all users with pagination

**Authentication:** Required

**Query Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 20 | Items per page (max 100) |
| sort | string | No | createdAt | Sort field |
| order | string | No | desc | Sort direction (asc/desc) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Response 401:** Unauthorized
**Response 429:** Rate limited

---

### POST /users

**Description:** Create a new user

**Authentication:** Required (admin only)

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "name": "string (required, 2-100 chars)",
  "password": "string (required, min 8 chars)",
  "role": "string (optional, default: 'user', enum: ['user', 'admin'])"
}
```

**Response 201:** ← NOTE: 201, not 200
```json
{
  "data": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "string",
    "createdAt": "ISO8601"
  }
}
```

**Response 400:** Validation error
**Response 401:** Unauthorized
**Response 409:** Email already exists

---
```
