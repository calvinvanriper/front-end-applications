# Front-End Applications Repository Standards

- This document defines the structural and development standards for all applications in this repository.
- The goal is consistency, clarity, and production-quality implementation—not experimentation or concept demonstration.

---

## 1. Application Structure (✅ REQUIRED)

- Each application must exist as a self-contained module within the repository:

```bash
applications/application-name/
```

- Each application must include:

```bash
application-name/
  index.html
  styles/
  js/
  README.md
```

- Applications are treated as **independent, deployable units**.

---

## 2. Code Standards (✅ REQUIRED)

- Code must prioritize:
  - readability
  - maintainability
  - separation of concerns

### JavaScript Standards

- Logic must be separated into appropriate layers:
  - state
  - workflows/business logic
  - UI rendering
  - event handlers

- Event listeners must not contain core logic  
  → they should call named functions

- DOM elements must be selected at the top of the file

- UI state should be:
  - derived from application state where possible
  - not duplicated unnecessarily

- Comments explain **intent ("why")**, not mechanics ("how")
- Semicolons are used consistently **(always)**

---

### HTML Standards

- HTML documents must include:

```html
<!doctype html>
<html lang="en">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</html>
```

- CSS must be linked in the `<head>`
- JavaScript must be loaded before the closing `</body>` tag

- Use semantic elements where appropriate:
  - `main`, `section`, `button`, `ul`, etc.

- Avoid inline styles and inline JavaScript

---

### CSS Standards

- CSS should follow a structured hierarchy:

1. Reset / global styles
2. Layout
3. Components
4. Utilities / state classes

- Class naming:
  - lowercase
  - kebab-case

- State classes must represent behavior:
  - `active`, `hidden`, `amount--negative`

- Use CSS variables for:
  - colors
  - spacing
  - reusable tokens

- Avoid `!important` unless absolutely necessary

---

## 3. Application Behavior Standards (✅ REQUIRED)

Applications must demonstrate:

- Clear user workflows (create, update, delete, confirm, etc.)
- Proper handling of edge cases
- Consistent UI feedback:
  - modals
  - toasts
  - validation messaging

- State-driven UI updates (not manual DOM patching across multiple locations)

---

## 4. README Standards (✅ REQUIRED)

Each application must include a README structured as a **product overview**, not a learning reflection.

### Required Sections

- 📝 Overview
- 🚀 Features
- 🧠 Architecture
- 🧩 Application Structure
- 💾 Persistence & Data Handling
- 🛠️ Tech Stack
- 🔗 Live Demo
- 💡 Development Notes

### Additional Rules

- Tone must be professional and product-focused
- Avoid “learning language” (e.g., “this project helped me understand…”)
- Focus on:
  - what the application does
  - how it is structured
  - why design decisions were made

---

## 5. Naming Conventions (✅ REQUIRED)

- Files and folders must use lowercase kebab-case:

```text
bank-account-ledger
transaction-workflows.js
```

---

## 6. Code Quality & Formatting (✅ REQUIRED)

### Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

If issues exist:

```bash
npm run lint:fix
npm run lint
```

All commits must pass:

```text
0 lint errors
```

---

## 7. Commit Message Standards (✅ REQUIRED)

Format:

```text
<type>(<scope>): <summary>
```

Example:

```text
feat(bank-account-ledger): implement overdraft confirmation workflow
```

### Allowed Types

- feat
- fix
- refactor
- docs
- style
- chore

### Scope

- application name
- repo-root
- tooling
- standards

### Guidelines

- Use present tense
- Be concise but descriptive
- Do not end with a period
- Explain **why** in the body when necessary

---

## 8. Application Development Workflow (🟡 RECOMMENDED)

Applications should be committed in logical phases:

1. scaffold application structure
2. implement core data/models
3. implement rendering logic
4. implement workflows and event handling
5. add persistence and state management
6. add UI polish and feedback systems
7. complete documentation

---

## 9. Out of Scope 🚫

- Over-engineering beyond the application’s purpose
- Refactoring stable logic for stylistic preference
- Rewriting applications after completion

---

## 🧭 Definition of Done

An application is considered complete when:

- All required standards are met
- Core workflows are functional and consistent
- UI behavior is predictable and user-friendly
- README is complete and professional
- Formatting and lint checks pass (0 errors)
