# Bank Account Ledger

## 📝 Overview

The Bank Account Ledger is a modular, state-driven front-end application for managing financial transactions. It supports both **pending** and **posted** transactions, calculates **real-time balances**, and provides structured workflows for handling edge cases such as overdrafts and data restoration.

The application is designed to simulate real-world financial tracking behavior while emphasizing maintainable architecture, clear UI feedback, and predictable state management.

---

## 🚀 Features

- Create, edit, and delete transactions
- Distinguish between **pending** and **posted** transaction states
- Real-time calculation of:
  - Posted balance
  - Projected balance (including pending transactions)
- Overdraft detection with confirmation workflows
- Undo delete functionality via toast notifications
- Persistent storage using `localStorage`
- JSON-based backup system:
  - Export ledger to file
  - Import and restore ledger from file
- Confirmation modals for destructive or high-impact actions
- Structured UI feedback:
  - Toast notifications
  - Modal dialogs
  - Inline validation messaging

---

## 🧠 Architecture

The application follows a modular structure with clear separation of concerns:

### Core Layers

- **Models**
  - `BankAccount` — manages ledger data and balance calculations
  - `AccountTransaction` — defines transaction structure

- **State**
  - Centralized UI and workflow state managed through `appState`

- **Workflows**
  - Encapsulates business logic for:
    - creating/updating transactions
    - overdraft handling
    - deletion and restoration flows

- **UI Layer**
  - Rendering logic isolated from business logic
  - DOM updates driven by application state

- **Handlers**
  - Event listeners call named functions
  - No business logic inside event listeners

---

## 🧩 Application Structure

```bash
bank-account-ledger/
  index.html
  styles/
    styles.css
    tokens.css
  js/
    config/
    handlers/
    ledger/
    models/
    state/
    storage/
    ui/
    utils/
```

The structure separates responsibilities into focused modules, making the application easier to extend and maintain.

---

## 💾 Persistence & Data Handling

- Ledger data is persisted using `localStorage`
- Data is rehydrated on application initialization
- Backup system:
  - Export ledger as a `.json` file
  - Import and replace ledger with confirmation modal
- Import validation ensures:
  - correct file format
  - safe state replacement

---

## 🛠️ Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5
- CSS3 (custom properties / design tokens)
- LocalStorage API

---

## 🔗 Live Demo

[View Application](https://calvinvanriper.dev/front-end-applications/applications/bank-account-ledger/)

---

## 💡 Development Notes

- UI is fully state-driven to ensure consistency across updates
- Business logic is isolated from event listeners for maintainability
- Reusable UI systems implemented for:
  - modals
  - toast notifications
- Edge cases (overdrafts, invalid imports, undo actions) are handled through explicit workflows
- Application designed with scalability in mind for future feature expansion
