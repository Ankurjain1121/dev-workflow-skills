---
name: contracts
description: Manage project contract registry. Subcommands: init (scan for shared types), list (show contracts), add (register new), sync (update producers/consumers). Used by /orchestrate for faster agent assignment.
version: 1.0.0
updated: 2025-01-13
---

# /contracts

Manage shared type contracts for multi-agent orchestration.

## Subcommands

| Command | Purpose |
|---------|---------|
| `/contracts init` | Scan project, find shared types, create registry |
| `/contracts list` | Display contracts with producers/consumers |
| `/contracts add <name>` | Add new contract to registry |
| `/contracts sync` | Re-scan imports, update producer/consumer mappings |

---

## `/contracts init`

Creates `.claude/contracts.json` by scanning project.

### Steps

1. **Scan type directories:**
   ```
   src/types/, src/dto/, src/contracts/, types/
   ```

2. **Find shared types** (imported by 2+ files):
   ```bash
   # For each interface/type, count importers
   Grep tool: pattern="import.*{.*TypeName.*}"
   If importers >= 2 → shared contract
   ```

3. **Trace producers/consumers:**
   - Producer: File that creates/returns the type
   - Consumer: File that receives/uses the type

4. **Generate registry:**
   ```json
   // .claude/contracts.json
   {
     "version": "1.0.0",
     "updated": "2025-01-13",
     "contracts": {
       "UserDTO": {
         "file": "src/types/user.ts",
         "line": "3-15",
         "producers": ["src/services/user.ts"],
         "consumers": ["src/components/UserCard.tsx"]
       }
     }
   }
   ```

5. **Report:** "Found X shared contracts in Y files"

---

## `/contracts list`

Displays current registry in table format.

### Output Format

```
Contracts Registry (.claude/contracts.json)
Updated: 2025-01-13

┌──────────────────┬────────────────────┬──────────────────┬──────────────────┐
│ Contract         │ File               │ Producers        │ Consumers        │
├──────────────────┼────────────────────┼──────────────────┼──────────────────┤
│ UserDTO          │ src/types/user.ts  │ services/user.ts │ UserCard.tsx     │
│ CreateUserReq    │ src/types/user.ts  │ api/users.ts     │ UserForm.tsx     │
│ ProductDTO       │ src/types/product  │ services/product │ ProductList.tsx  │
└──────────────────┴────────────────────┴──────────────────┴──────────────────┘

3 contracts registered
```

### If No Registry

```
No registry found. Run /contracts init to create one.
```

---

## `/contracts add <name>`

Add a new contract to registry manually.

### Usage

```
/contracts add UserDTO
```

### Steps

1. **Prompt for file location:**
   ```
   Where is UserDTO defined? (e.g., src/types/user.ts)
   ```

2. **Find line numbers:**
   ```bash
   Grep: pattern="interface UserDTO|type UserDTO"
   ```

3. **Scan for imports:**
   ```bash
   Grep: pattern="import.*UserDTO"
   ```

4. **Classify producers/consumers:**
   - If file has `return.*UserDTO` or `Promise<UserDTO>` → producer
   - Otherwise → consumer

5. **Add to registry**

6. **Report:** "Added UserDTO with 2 producers, 3 consumers"

---

## `/contracts sync`

Re-scan imports and update producer/consumer mappings.

### When to Use

- After adding new files that use existing contracts
- After refactoring imports
- Before running `/orchestrate`

### Steps

1. **Read current registry**

2. **For each contract:**
   ```bash
   Grep: pattern="import.*{.*ContractName.*}"
   ```

3. **Update producers/consumers**

4. **Report changes:**
   ```
   Sync complete:
   - UserDTO: +1 consumer (NewComponent.tsx)
   - ProductDTO: -1 producer (deleted OldService.ts)
   - 2 contracts unchanged
   ```

---

## Registry Schema

```json
{
  "version": "1.0.0",
  "updated": "YYYY-MM-DD",
  "contracts": {
    "<ContractName>": {
      "file": "path/to/definition.ts",
      "line": "start-end",
      "producers": ["path/to/producer1.ts", "path/to/producer2.ts"],
      "consumers": ["path/to/consumer1.tsx", "path/to/consumer2.tsx"]
    }
  }
}
```

---

## Integration with /orchestrate

When `/orchestrate` runs:

1. Check for `.claude/contracts.json`
2. If exists: Skip Phase 1 (Discover), use registry
3. Display: "Using registry: UserDTO, CreateUserReq"
4. Assign agents based on producer/consumer files
5. After completion: "Run /contracts sync to update registry"
