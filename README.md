# Front-End Applications

A collection of modular, state-driven applications built with vanilla JavaScript, HTML, and CSS.

These projects focus on practical user workflows, maintainable architecture, persistent client-side data, and accessible responsive interfaces. Each application functions as a standalone product with its own documentation, live deployment, and source directory.

## Applications

### Personal Finance Dashboard

A modular financial dashboard for tracking market data, savings goals, currencies, precious metals, and asset allocation from a unified interface.

#### Personal Finance Dashboard Highlights

- Stock watchlist with live quotes, autocomplete, caching, and batch updates
- Precious-metals tracking with refresh controls and fallback data
- Currency conversion and persistent currency watchlists
- Savings-goal creation, editing, sorting, and progress tracking
- Asset-allocation portfolio with grouped categories and visual summaries
- JSON backup and restoration with validation and partial recovery
- Reusable modal, notification, confirmation, and validation systems
- Persistent browser storage using `localStorage`

[View Live Application](https://calvinvanriper.dev/front-end-applications/applications/personal-finance-dashboard/) · [View Source and Documentation](https://github.com/calvinvanriper/front-end-applications/tree/main/applications/personal-finance-dashboard)

---

### Account Transaction Ledger

A state-driven account-management application that models the lifecycle of pending and posted transactions while maintaining accurate posted and projected balances.

#### Account Transaction Ledger Highlights

- Pending and posted transaction workflows
- Real-time posted and projected balance calculations
- Transaction creation, editing, posting, and deletion
- Overdraft detection with confirmation workflows
- Undo-delete functionality through interactive notifications
- Persistent browser storage using `localStorage`
- JSON export, import, and data-restoration workflows
- Modular separation of models, state, workflows, handlers, and UI rendering

[View Live Application](https://calvinvanriper.dev/front-end-applications/applications/bank-account-ledger/) · [View Source and Documentation](https://github.com/calvinvanriper/front-end-applications/tree/main/applications/bank-account-ledger)

## Engineering Approach

Applications in this repository follow a consistent set of development practices:

- Centralized application state drives interface updates
- Business rules are separated from DOM rendering
- Event listeners delegate behavior to named handler functions
- Multi-step operations are coordinated through workflow modules
- Data entering the application is validated and normalized
- Reusable interface systems handle modals, notifications, confirmations, and validation feedback
- Browser persistence and recovery workflows protect user-entered data
- Responsive layouts and accessible interaction patterns support a range of devices and input methods

## Technology

- Vanilla JavaScript
- JavaScript ES Modules
- HTML5
- CSS3
- REST API integration
- Web Storage API
- JSON import and export
- Responsive and accessible interface design

## Repository Structure

Each application is maintained in its own directory:

```text
applications/
├── personal-finance-dashboard/
└── bank-account-ledger/
```

Application directories contain their own implementation files and detailed README documentation covering features, architecture, usage, and project-specific decisions.

## Portfolio

Additional project context, screenshots, and professional experience are available at [calvinvanriper.dev](https://calvinvanriper.dev).
