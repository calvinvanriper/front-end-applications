export const appState = {
  // Tracks the transaction currently being edited (null when not editing)
  editingTransactionId: null,

  // Stores the last deleted transaction for undo functionality
  lastDeletedTransaction: null,

  // Snapshot of the form when editing begins (used for discard logic)
  initialFormState: null,

  // Holds transaction data when overdraft confirmation is required
  pendingOverdraftTransaction: null,

  // Holds transaction data when overdraft risk warning is required
  pendingRiskTransaction: null,

  // Stores transaction awaiting delete confirmation
  pendingDeleteTransaction: null,

  // Holds validated imported ledger data awaiting confirmation
  pendingImportedLedger: null,
};

export function clearPendingTransactionReviewStates() {
  appState.pendingOverdraftTransaction = null;
  appState.pendingRiskTransaction = null;
}
