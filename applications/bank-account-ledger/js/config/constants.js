export const categories = {
  deposit: [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'direct-deposit', label: 'Direct Deposit' },
    { value: 'other', label: 'Other' },
  ],
  withdraw: [
    { value: 'utilities', label: 'Utilities' },
    { value: 'grocery', label: 'Grocery Store' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'atm', label: 'ATM' },
    { value: 'other', label: 'Other' },
  ],
};

export const transactionMessages = {
  errors: {
    invalidAmount: 'Enter an amount greater than 0',
    invalidType: 'Select a valid transaction type',
    invalidFile: 'Invalid backup file',
    noImportData: 'No import data found. Please select a backup file again.',
  },
  success: {
    depositPosted: 'Deposit posted successfully',
    depositPending: 'Pending deposit successful',
    withdrawPosted: 'Withdrawal posted successfully',
    withdrawPending: 'Pending withdrawal successful',
    overdraftPosted: 'Overdraft withdrawal posted successfully',
    postedTransactionUpdated: 'Transaction updated successfully',
    pendingTransactionUpdated: 'Pending transaction updated successfully',
    postedTransactionDeleted: 'Transaction deleted successfully',
    pendingTransactionDeleted: 'Pending transaction deleted successfully',
    postedTransactionRestored: 'Transaction restored successfully',
    pendingTransactionRestored: 'Pending transaction restored successfully',
    ledgerCleared: 'Transaction ledger cleared successfully',
    ledgerImported: 'Ledger imported successfully',
  },
};

export const categoryLookup = Object.values(categories).reduce((lookup, group) => {
  group.forEach((item) => {
    lookup[item.value] = item.label;
  });

  return lookup;
}, {});

export const transactionFieldConfig = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
];

export const TOAST_TONES = Object.freeze({
  added: 'added',
  deleted: 'deleted',
  restored: 'restored',
  updated: 'updated',
  cleared: 'cleared',
  danger: 'danger',
});

export const TRANSACTION_STATUS = Object.freeze({
  POSTED: 'posted',
  PENDING: 'pending',
});

export const TRANSACTION_TYPES = Object.freeze({
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
});
