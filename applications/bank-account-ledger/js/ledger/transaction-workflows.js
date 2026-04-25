import { clearLedgerFromStorage, saveLedgerToStorage } from '../storage/persistence.js';
import { renderSummary, renderTransactions } from '../ui/render.js';
import { appState, clearPendingTransactionReviewStates } from '../state/app-state.js';
import { showToast } from '../ui/notifications.js';
import { transactionMessages, TOAST_TONES } from '../config/constants.js';
import {
  clearAmountError,
  showAmountError,
  showFormMessage,
  getFormState,
  hideTransactionForm,
} from '../ui/form-ui.js';
import * as modal from '../ui/modals.js';
import { AccountTransaction } from '../models/AccountTransaction.js';

export function clearLedger(myAccount) {
  myAccount.bankLedger = [];

  clearLedgerFromStorage();
  showToast(transactionMessages.success.ledgerCleared, { actionTone: TOAST_TONES.cleared });
  refreshLedgerUI(myAccount);
}

export function refreshLedgerUI(myAccount) {
  renderSummary(myAccount);
  renderTransactions(myAccount);
}

export function finalizeTransactionUpdate(myAccount) {
  refreshLedgerUI(myAccount);
  hideTransactionForm();
}

export function undoDeleteTransaction(myAccount) {
  if (!appState.lastDeletedTransaction) return;

  const restoredTransaction = appState.lastDeletedTransaction;

  myAccount.bankLedger.push(restoredTransaction);
  myAccount.sortLedgerByDate();

  const message =
    restoredTransaction.status === 'pending'
      ? transactionMessages.success.pendingTransactionRestored
      : transactionMessages.success.postedTransactionRestored;

  appState.lastDeletedTransaction = null;

  saveLedgerToStorage(myAccount.bankLedger);
  refreshLedgerUI(myAccount);
  showToast(message, { actionTone: TOAST_TONES.restored, valueTone: restoredTransaction.type });
}

export function commitTransaction(transaction, myAccount, options = {}) {
  const result = myAccount.postToLedger(transaction, options);

  if (result.success) {
    myAccount.sortLedgerByDate();
    clearAmountError();

    const message = transactionMessages.success[result.reason];

    showToast(message, {
      actionTone: TOAST_TONES.added,
      valueTone: transaction.type,
    });

    saveLedgerToStorage(myAccount.bankLedger);
    finalizeTransactionUpdate(myAccount);
    return;
  }

  const message = transactionMessages.errors[result.reason];

  if (result.reason === 'invalidAmount') {
    showAmountError(message);
    return;
  }

  showFormMessage(message);
}

export function applyTransactionUpdate(
  transaction,
  { date, type, description, category, amount, sequence, status }
) {
  transaction.date = date;
  transaction.type = type;
  transaction.description = description;
  transaction.category = category;
  transaction.amount = amount;
  transaction.sequence = sequence;
  transaction.status = status;
}

export function updateExistingTransaction(
  { date, type, description, category, amount, status },
  myAccount
) {
  const transaction = myAccount.bankLedger.find(
    (item) => item.id === appState.editingTransactionId
  );

  if (!transaction) return;

  const updatedValues = { date, type, description, category, amount, status };

  const projectedEdit = myAccount.getProjectedLedgerForEdit(
    appState.editingTransactionId,
    updatedValues
  );

  if (!projectedEdit) {
    showFormMessage('Posted transactions cannot be changed back to pending.');
    return;
  }

  const { projectedLedger, updatedTransaction, overdraftStartIndex } = projectedEdit;

  if (updatedTransaction.status === 'pending') {
    const riskAnalysis = myAccount.getProjectedRiskForPendingEdit(
      appState.editingTransactionId,
      updatedTransaction
    );

    if (riskAnalysis.hasOverdraft === true) {
      appState.pendingRiskTransaction = buildTransactionRiskState('edit', riskAnalysis, {
        originalTransaction: transaction,
        updatedTransaction,
      });

      modal.showPendingOverdraftWarning();
      return;
    }

    completeTransactionUpdate(transaction, updatedTransaction, myAccount);
    return;
  }

  const analysis = myAccount.getFirstOverdraftInLedger(projectedLedger, overdraftStartIndex);

  if (analysis.hasOverdraft === true) {
    appState.pendingOverdraftTransaction = buildTransactionRiskState('edit', analysis, {
      originalTransaction: transaction,
      updatedTransaction,
    });

    modal.showOverdraftConfirmation();
    return;
  }

  completeTransactionUpdate(transaction, updatedTransaction, myAccount);
}

export function createNewTransaction(
  { date, type, description, category, amount, status },
  myAccount
) {
  const transaction = new AccountTransaction(
    date,
    type,
    description,
    category,
    amount,
    null,
    status
  );

  if (transaction.status !== 'pending' && transaction.status !== 'posted') {
    showFormMessage('Invalid transaction status');
    return;
  }

  transaction.sequence = myAccount.getNextSequence();

  if (transaction.status === 'pending') {
    const riskAnalysis = myAccount.getProjectedRiskForPendingTransaction(transaction);

    if (riskAnalysis.hasOverdraft === true) {
      appState.pendingRiskTransaction = buildTransactionRiskState('create', riskAnalysis, {
        transaction,
      });

      modal.showPendingOverdraftWarning();
      return;
    }

    commitTransaction(transaction, myAccount);
    return;
  }

  const analysis = myAccount.getProjectedBalanceForTransaction(transaction);

  if (analysis.hasOverdraft === true) {
    appState.pendingOverdraftTransaction = buildTransactionRiskState('create', analysis, {
      transaction,
    });

    modal.showOverdraftConfirmation();
    return;
  }

  commitTransaction(transaction, myAccount);
}

export function deleteTransaction(myAccount) {
  if (!appState.editingTransactionId || !appState.pendingDeleteTransaction) return;

  const transactionToDelete = appState.pendingDeleteTransaction;

  modal.hideDeleteConfirmation();
  completeTransactionDelete(transactionToDelete, myAccount);
}

export function processTransaction(myAccount) {
  clearAmountError();

  const { date, type, category, description, amount, status } = getFormState();

  const transactionValues = { date, type, category, description, amount: Number(amount), status };

  if (appState.editingTransactionId) {
    updateExistingTransaction(transactionValues, myAccount);
    return;
  }

  createNewTransaction(transactionValues, myAccount);
}

export function processRiskTransactionProceed(myAccount) {
  if (!appState.pendingRiskTransaction) return;

  modal.hideOverdraftConfirmation();

  if (appState.pendingRiskTransaction.mode === 'create') {
    const transaction = appState.pendingRiskTransaction.transaction;

    clearPendingTransactionReviewStates();
    commitTransaction(transaction, myAccount);
    return;
  }

  if (appState.pendingRiskTransaction.mode === 'edit') {
    const { originalTransaction, updatedTransaction } = appState.pendingRiskTransaction;

    clearPendingTransactionReviewStates();
    completeTransactionUpdate(originalTransaction, updatedTransaction, myAccount);
    return;
  }

  if (appState.pendingRiskTransaction.mode === 'delete') {
    if (!appState.editingTransactionId || !appState.pendingDeleteTransaction) {
      clearPendingTransactionReviewStates();
      return;
    }

    const transactionToDelete = appState.pendingDeleteTransaction;

    clearPendingTransactionReviewStates();
    completeTransactionDelete(transactionToDelete, myAccount);
    return;
  }
}

export function processOverdraftProceed(myAccount) {
  if (!appState.pendingOverdraftTransaction) return;

  modal.hideOverdraftConfirmation();

  if (appState.pendingOverdraftTransaction.mode === 'create') {
    const transaction = appState.pendingOverdraftTransaction.transaction;

    clearPendingTransactionReviewStates();
    commitTransaction(transaction, myAccount, {
      isOverdraftApproved: true,
    });

    return;
  }

  if (appState.pendingOverdraftTransaction.mode === 'edit') {
    if (!appState.editingTransactionId) {
      clearPendingTransactionReviewStates();
      return;
    }

    const { originalTransaction, updatedTransaction } = appState.pendingOverdraftTransaction;

    clearPendingTransactionReviewStates();
    completeTransactionUpdate(originalTransaction, updatedTransaction, myAccount);
    return;
  }

  if (appState.pendingOverdraftTransaction.mode === 'delete') {
    if (!appState.editingTransactionId || !appState.pendingDeleteTransaction) {
      clearPendingTransactionReviewStates();
      return;
    }

    const transactionToDelete = appState.pendingDeleteTransaction;

    clearPendingTransactionReviewStates();
    completeTransactionDelete(transactionToDelete, myAccount);
  }
}

export function prepareDeleteTransaction(myAccount) {
  if (!appState.editingTransactionId) return;

  appState.pendingDeleteTransaction = myAccount.bankLedger.find((transaction) => {
    return transaction.id === appState.editingTransactionId;
  });

  if (!appState.pendingDeleteTransaction) return;

  const { projectedLedger, transactionIndex } = myAccount.getProjectedLedgerForDelete(
    appState.editingTransactionId
  );
  const analysis = myAccount.getFirstOverdraftInLedger(projectedLedger, transactionIndex);

  if (analysis.hasOverdraft) {
    if (appState.pendingDeleteTransaction.status === 'pending') {
      appState.pendingRiskTransaction = buildTransactionRiskState('delete', analysis, {
        originalTransaction: appState.pendingDeleteTransaction,
      });

      modal.showPendingOverdraftWarning();
      return;
    }

    appState.pendingOverdraftTransaction = buildTransactionRiskState('delete', analysis, {
      originalTransaction: appState.pendingDeleteTransaction,
    });

    modal.showDeleteOverdraftConfirmation();
    return;
  }

  modal.showDeleteConfirmation();
}

function completeTransactionUpdate(transaction, updatedTransaction, myAccount) {
  applyTransactionUpdate(transaction, updatedTransaction);
  myAccount.sortLedgerByDate();

  appState.editingTransactionId = null;

  const message =
    updatedTransaction.status === 'pending'
      ? transactionMessages.success.pendingTransactionUpdated
      : transactionMessages.success.postedTransactionUpdated;

  showToast(message, { actionTone: TOAST_TONES.updated, valueTone: updatedTransaction.type });

  saveLedgerToStorage(myAccount.bankLedger);
  finalizeTransactionUpdate(myAccount);
}

function buildTransactionRiskState(mode, analysis, extraState = {}) {
  return {
    mode,
    overdraftTransaction: analysis.overdraftTransaction,
    currentBalance: analysis.balanceBeforeTransaction,
    projectedBalance: analysis.runningBalanceAtTransaction,
    finalBalance: analysis.finalBalance,
    ...extraState,
  };
}

function completeTransactionDelete(transactionToDelete, myAccount) {
  appState.lastDeletedTransaction = transactionToDelete;
  appState.pendingDeleteTransaction = null;

  myAccount.removeTransactionById(transactionToDelete.id);

  const message =
    transactionToDelete.status === 'pending'
      ? transactionMessages.success.pendingTransactionDeleted
      : transactionMessages.success.postedTransactionDeleted;

  showToast(message, {
    actionTone: TOAST_TONES.deleted,
    valueTone: transactionToDelete.type,
    actionLabel: 'undo',
    onAction: () => undoDeleteTransaction(myAccount),
  });

  saveLedgerToStorage(myAccount.bankLedger);
  finalizeTransactionUpdate(myAccount);
  appState.editingTransactionId = null;
}
