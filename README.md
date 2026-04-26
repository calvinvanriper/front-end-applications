# Front-End Applications

This repository contains a collection of front-end applications built with a focus on:

- modular architecture
- maintainable code structure
- state-driven UI behavior
- real-world user workflows

Each application is designed to function as a standalone product, with clear separation of concerns, predictable state management, and production-minded implementation patterns.

---

## 🚀 Applications

### 🧾 Bank Account Ledger

A state-driven financial tracking application that supports pending and posted transactions, real-time balance calculations, and structured workflows for handling overdrafts and data restoration.

**Key Features:**

- Pending vs posted transaction system
- Real-time posted and projected balances
- Overdraft detection with confirmation workflows
- Undo delete functionality
- Persistent storage using `localStorage`
- JSON import/export backup system
- Modular architecture with separated concerns

🔗 **Live Demo:**  
[View Application](https://calvinvanriper.dev/front-end-applications/applications/bank-account-ledger/)

---

## 🧠 Development Approach

Applications in this repository follow a consistent engineering approach:

- Business logic is separated from UI rendering
- Event listeners delegate to named handler functions
- Application state is centralized and drives UI updates
- Reusable UI systems are implemented for:
  - modals
  - notifications
  - validation feedback

---

## 🛠️ Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5
- CSS3 (with design tokens and structured styles)
- LocalStorage API

---

## 📌 Notes

This repository focuses on building **complete, functional applications**, rather than isolated exercises. Each project emphasizes usability, clarity, and maintainability.

Additional applications will be added over time.
