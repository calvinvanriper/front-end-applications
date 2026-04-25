import * as modal from '../ui/modals.js';
import * as workflows from '../ledger/transaction-workflows.js';
import {
  hasUnsavedChanges,
  hideTransactionForm,
  getFormState,
  showTransactionForm,
  populateTransactionForm,
} from '../ui/form-ui.js';
import { dom } from '../ui/dom.js';
import { appState, clearPendingTransactionReviewStates } from '../state/app-state.js';
import { readLedgerBackupFile, saveLedgerToStorage } from '../storage/persistence.js';
import { showToast } from '../ui/notifications.js';
import { transactionMessages, TOAST_TONES } from '../config/constants.js';

export function handleAttemptCloseTransactionForm() {
  if (!hasUnsavedChanges()) {
    hideTransactionForm();
    return;
  }

  modal.showDiscardConfirmation(getFormState());
}

export function handleTransactionOverlayClick(event) {
  if (event.target !== dom.overlay) return;

  handleAttemptCloseTransactionForm();
}

export function handleDiscardChanges() {
  modal.hideDiscardConfirmation();
  hideTransactionForm();
}

export function handleClearLedgerCancel() {
  modal.hideClearLedgerModal();
}

export function handleClearLedgerClick(myAccount) {
  if (myAccount.bankLedger.length === 0) return;
  const transactionCount = myAccount.bankLedger.length;
  const postedBalance = myAccount.getPostedBalance();
  const pendingTransactionCount = myAccount.getPendingTransactions().length;
  const projectedBalance = myAccount.getProjectedBalance();

  modal.showClearLedgerModal(
    transactionCount,
    postedBalance,
    pendingTransactionCount,
    projectedBalance
  );
}

export function handleTransactionEditClick(event, myAccount) {
  const editButton = event.target.closest('.edit-btn');

  if (!editButton) return;

  const transactionId = editButton.dataset.id;
  const transaction = myAccount.bankLedger.find((item) => item.id === transactionId);

  if (!transaction) return;

  appState.editingTransactionId = transactionId;
  showTransactionForm();
  populateTransactionForm(transaction);
  appState.initialFormState = getFormState();
}

export function handleOverdraftProceedClick(myAccount) {
  if (!appState.pendingOverdraftTransaction && !appState.pendingRiskTransaction) return;

  if (appState.pendingOverdraftTransaction) {
    workflows.processOverdraftProceed(myAccount);
    return;
  }

  if (appState.pendingRiskTransaction) {
    workflows.processRiskTransactionProceed(myAccount);
    return;
  }
}

export function handleOverdraftEdit() {
  clearPendingTransactionReviewStates();

  modal.hideOverdraftConfirmation();
}

export function handleOverdraftCancel() {
  const mode = appState.pendingOverdraftTransaction?.mode ?? appState.pendingRiskTransaction?.mode;

  if (mode === 'delete') {
    appState.pendingDeleteTransaction = null;
  }

  clearPendingTransactionReviewStates();

  modal.hideOverdraftConfirmation();

  if (mode === 'create') {
    hideTransactionForm();
  }
}

export function handleClearLedgerConfirm(onClearLedger) {
  onClearLedger();
  modal.hideClearLedgerModal();
}

export async function handleImportLedger(event, myAccount) {
  const file = event.target.files?.[0];

  if (!file) return;

  const importedLedger = await readLedgerBackupFile(file);

  if (!importedLedger) {
    showToast(transactionMessages.errors.invalidFile, { actionTone: TOAST_TONES.danger });

    event.target.value = '';
    return;
  }

  appState.pendingImportedLedger = importedLedger;

  modal.showImportLedgerConfirmation(
    getLedgerSummary(myAccount),
    getLedgerSummary(myAccount, importedLedger)
  );

  event.target.value = '';
}

function getLedgerSummary(myAccount, ledger = myAccount.bankLedger) {
  const originalLedger = myAccount.bankLedger;

  myAccount.bankLedger = ledger;

  const summary = {
    transactionCount: ledger.length,
    projectedBalance: myAccount.getProjectedBalance(),
  };

  myAccount.bankLedger = originalLedger;

  return summary;
}

export function handleImportLedgerConfirm(myAccount) {
  if (!appState.pendingImportedLedger) {
    showToast(transactionMessages.errors.noImportData, { actionTone: TOAST_TONES.danger });
    return;
  }

  myAccount.bankLedger = appState.pendingImportedLedger;
  myAccount.sortLedgerByDate();

  appState.pendingImportedLedger = null;

  saveLedgerToStorage(myAccount.bankLedger);
  workflows.refreshLedgerUI(myAccount);

  showToast(transactionMessages.success.ledgerImported, { actionTone: TOAST_TONES.added });

  modal.hideImportLedgerConfirmation();
}

export function handleImportLedgerCancel() {
  appState.pendingImportedLedger = null;
  modal.hideImportLedgerConfirmation();
}
