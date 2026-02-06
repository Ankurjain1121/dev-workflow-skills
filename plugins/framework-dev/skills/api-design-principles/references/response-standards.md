# Response Structure Standards

## Success Response Envelope

```json
{
  "data": {
    "id": "task-123",
    "type": "task",
    "attributes": {
      "title": "Implement login",
      "status": "active"
    }
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

## List Response Envelope

```json
{
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Error Response Structure

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ],
    "requestId": "uuid"
  }
}
```
