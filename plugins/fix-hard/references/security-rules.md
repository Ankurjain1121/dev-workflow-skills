# Security Rules Reference

Comprehensive security scanning rules for `/fix-hard`.

## Semgrep Rule Categories

### Core Security (Always Run)

```bash
# Auto-select rules based on detected languages
semgrep scan --config auto
```

### OWASP Top 10

```bash
semgrep scan --config "p/owasp-top-ten"
```

| ID | Category | Examples |
|----|----------|----------|
| A01 | Broken Access Control | Missing auth checks, IDOR |
| A02 | Cryptographic Failures | Weak hashing, hardcoded keys |
| A03 | Injection | SQL, Command, LDAP injection |
| A04 | Insecure Design | Business logic flaws |
| A05 | Security Misconfiguration | Debug mode, default creds |
| A06 | Vulnerable Components | Outdated dependencies |
| A07 | Auth Failures | Weak passwords, session issues |
| A08 | Data Integrity Failures | Insecure deserialization |
| A09 | Logging Failures | Missing audit logs |
| A10 | SSRF | Server-side request forgery |

### Secrets Detection

```bash
semgrep scan --config "p/secrets"
```

Detects:
- API keys (AWS, GCP, Azure, Stripe, etc.)
- Private keys (SSH, PGP, certificates)
- Database credentials
- OAuth tokens
- JWT secrets

### Supply Chain

```bash
semgrep scan --config "p/supply-chain"
```

Detects:
- Typosquatting packages
- Malicious dependencies
- Dependency confusion risks

## Language-Specific Rules

### JavaScript/TypeScript
```bash
semgrep scan --config "p/javascript"
semgrep scan --config "p/typescript"
semgrep scan --config "p/react"
semgrep scan --config "p/nodejs"
```

### Python
```bash
semgrep scan --config "p/python"
semgrep scan --config "p/django"
semgrep scan --config "p/flask"
```

### Go
```bash
semgrep scan --config "p/golang"
```

### Rust
```bash
semgrep scan --config "p/rust"
```

## Severity Mapping

| Semgrep Severity | /fix-hard Action |
|------------------|------------------|
| ERROR (Critical) | Must fix, blocks pass |
| WARNING (High) | Must fix, blocks pass |
| INFO (Medium) | Should fix |
| NOTE (Low) | Nice to fix |

## Pro Engine Features

```bash
# Enable cross-file analysis (requires login)
semgrep scan --config auto --pro
```

Cross-file analysis detects:
- Taint tracking across functions
- Data flow through imports
- Indirect vulnerabilities

## CI Integration

```yaml
# GitHub Actions
- name: Semgrep Security Scan
  uses: returntocorp/semgrep-action@v1
  with:
    config: >-
      p/security-audit
      p/owasp-top-ten
      p/secrets
```

## Ignoring False Positives

```yaml
# .semgrepignore
# Ignore test files for secrets scanning
tests/**/*_test.py
**/*.test.ts

# Ignore vendor
vendor/
node_modules/
```

```python
# Inline ignore (use sparingly!)
# nosemgrep: rule-id-here
```
