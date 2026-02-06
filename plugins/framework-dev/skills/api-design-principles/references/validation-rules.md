# Validation Rules

## Request Validation Template

Document validation in the contract:

```yaml
CreateUser:
  email:
    type: string
    required: true
    format: email
    maxLength: 255

  name:
    type: string
    required: true
    minLength: 2
    maxLength: 100
    pattern: "^[a-zA-Z ]+$"

  password:
    type: string
    required: true
    minLength: 8
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$"

  role:
    type: string
    required: false
    enum: [user, admin]
    default: user
```
