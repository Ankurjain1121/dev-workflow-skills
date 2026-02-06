---
name: openapi-spec-generation
description: Use when converting API contracts to OpenAPI 3.1 specification or generating SDK clients.
allowed-tools: Read, Write, Bash
---

# OpenAPI Specification Generation

This skill guides the creation of OpenAPI 3.1 specifications from the API contracts defined in Phase 3, enabling SDK generation and interactive documentation.

---

## OpenAPI 3.1 Template

See `references/openapi-template.yaml` for the complete OpenAPI 3.1 specification template. The template includes info block with metadata and rate limits, multiple server environments, tagged endpoints with operationIds, reusable parameters and schemas in components section, security schemes (Bearer JWT), request/response schemas, and standardized error responses.

---

## Converting api-contracts.md to OpenAPI

### Step 1: Extract Endpoints

From `api-contracts.md`:
```markdown
### GET /users
**Response 200:**
```json
{ "data": [...], "meta": {...} }
```
```

To OpenAPI:
```yaml
paths:
  /users:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
```

### Step 2: Define Schemas

From response examples, create component schemas.

### Step 3: Add Security

```yaml
security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
```

---

## Validation

### Using Spectral

```bash
npm install -g @stoplight/spectral-cli
spectral lint openapi.yaml
```

### Common Issues

| Issue | Fix |
|-------|-----|
| Missing operationId | Add unique operationId to each operation |
| No examples | Add example values to schemas |
| Missing descriptions | Document all endpoints and schemas |

---

## SDK Generation

### Using OpenAPI Generator

```bash
# TypeScript SDK
openapi-generator generate \
  -i openapi.yaml \
  -g typescript-fetch \
  -o ./sdk/typescript

# Python SDK
openapi-generator generate \
  -i openapi.yaml \
  -g python \
  -o ./sdk/python
```

### Using Orval (TypeScript)

```bash
npm install orval
orval --config orval.config.ts
```

---

## Integration with Framework Developer

During Phase 3:
1. Define API contracts in markdown
2. Convert to OpenAPI spec
3. Validate spec
4. Generate SDKs if needed
5. Store in `03-api-planning/openapi.yaml`
