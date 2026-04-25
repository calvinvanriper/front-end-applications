// -----------------------------------------------------------------
// ------------------------MODULE IMPORTS---------------------------
// -----------------------------------------------------------------

import { BankAccount } from './models/BankAccount.js';
import { loadLedgerFromStorage, downloadLedgerBackup } from './storage/persistence.js';
import { dom } from './ui/dom.js';
import * as modal from './ui/modals.js';
import {
  openCreateTransactionForm,
  clearAmountError,
  updateCategoryOptions,
} from './ui/form-ui.js';
import * as handlers from './handlers/event-handlers.js';
import * as workflows from './ledger/transaction-workflows.js';

// -----------------------------------------------------------------
// -------------------APPLICATION INITIALIZATION--------------------
// -----------------------------------------------------------------

const myAccount = new BankAccount();

function initializeApp() {
  myAccount.bankLedger = loadLedgerFromStorage();

  myAccount.sortLedgerByDate();

  workflows.refreshLedgerUI(myAccount);
}

initializeApp();

// -----------------------------------------------------------------
// ---------------------EVENT LISTENER WIRING-----------------------
// -----------------------------------------------------------------

function handleTransactionTypeChange(event) {
  updateCategoryOptions(event.target.value);
  clearAmountError;
}

// -----------------------------------------------------------------
// ------------------------EVENT LISTENERS--------------------------
// -----------------------------------------------------------------

dom.typeInputs.forEach((input) => {
  input.addEventListener('change', handleTransactionTypeChange);
});

dom.form.addEventListener('submit', (event) => {
  event.preventDefault();
  workflows.processTransaction(myAccount);
});

dom.newBtn.addEventListener('click', openCreateTransactionForm);
dom.cancelBtn.addEventListener('click', handlers.handleAttemptCloseTransactionForm);
dom.closeBtn.addEventListener('click', handlers.handleAttemptCloseTransactionForm);
dom.deleteBtn.addEventListener('click', () => {
  workflows.prepareDeleteTransaction(myAccount);
});
dom.confirmDeleteBtn.addEventListener('click', () => {
  workflows.deleteTransaction(myAccount);
});
dom.cancelDeleteBtn.addEventListener('click', modal.hideDeleteConfirmation);
dom.transactionAmount.addEventListener('input', clearAmountError);
dom.transactionCategory.addEventListener('change', clearAmountError);
dom.pendingTransactions.addEventListener('click', (event) => {
  handlers.handleTransactionEditClick(event, myAccount);
});
dom.postedTransactions.addEventListener('click', (event) => {
  handlers.handleTransactionEditClick(event, myAccount);
});
dom.overlay.addEventListener('click', handlers.handleTransactionOverlayClick);
dom.keepEditingBtn.addEventListener('click', modal.hideDiscardConfirmation);
dom.discardChangesBtn.addEventListener('click', handlers.handleDiscardChanges);
dom.overdraftProceedBtn.addEventListener('click', () => {
  handlers.handleOverdraftProceedClick(myAccount);
});
dom.overdraftEditBtn.addEventListener('click', handlers.handleOverdraftEdit);
dom.overdraftCancelBtn.addEventListener('click', handlers.handleOverdraftCancel);
dom.clearLedgerBtn.addEventListener('click', () => {
  handlers.handleClearLedgerClick(myAccount);
});
dom.confirmClearLedgerBtn.addEventListener('click', () => {
  handlers.handleClearLedgerConfirm(() => workflows.clearLedger(myAccount));
});
dom.cancelClearLedgerBtn.addEventListener('click', handlers.handleClearLedgerCancel);
dom.exportLedgerBtn.addEventListener('click', async () => {
  await downloadLedgerBackup(myAccount.bankLedger);
});
dom.importLedgerInput.addEventListener('change', (event) => {
  handlers.handleImportLedger(event, myAccount);
});
dom.confirmImportLedgerBtn.addEventListener('click', () => {
  handlers.handleImportLedgerConfirm(myAccount);
});
dom.cancelImportLedgerBtn.addEventListener('click', handlers.handleImportLedgerCancel);
