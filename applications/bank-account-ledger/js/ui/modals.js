import { dom } from './dom.js';
import { renderDiscardReview, renderOverdraftReview, renderOverdraftRiskReview } from './render.js';
import { appState } from '../state/app-state.js';
import { formatCurrency, formatForDisplay } from '../utils/formatters.js';

export function hideDeleteConfirmation() {
  dom.deleteConfirmOverlay.classList.add('hidden');
  dom.deleteConfirmMessage.textContent = '';
}

export function showDiscardConfirmation(currentState) {
  renderDiscardReview(currentState);
  dom.discardConfirmOverlay.classList.remove('hidden');
}

export function hideDiscardConfirmation() {
  dom.discardConfirmOverlay.classList.add('hidden');
}

export function hideOverdraftConfirmation() {
  dom.overdraftConfirmOverlay.classList.add('hidden');
}

export function hideClearLedgerModal() {
  dom.clearLedgerOverlay.classList.add('hidden');
}

export function showDeleteConfirmation() {
  if (!appState.editingTransactionId || !appState.pendingDeleteTransaction) return;

  const transactionToDelete = appState.pendingDeleteTransaction;

  if (!transactionToDelete) return;

  dom.deleteConfirmMessage.innerHTML = `<span>Please confirm you want to delete this transaction:</span>
    <div class="confirm-details">
      <div><strong>Type:</strong> <span>${formatForDisplay(transactionToDelete.type)}</span></div>
      <div><strong>Amount:</strong> <span>${formatCurrency(transactionToDelete.amount)}</span></div>
      <div><strong>Description:</strong> <span>${transactionToDelete.description}</span></div>
    </div>`;

  dom.deleteConfirmOverlay.classList.remove('hidden');
}

export function showDeleteOverdraftConfirmation() {
  if (!appState.pendingOverdraftTransaction) return;

  configureOverdraftModal({
    title: 'Delete Overdraft Warning',
    message: `
    <p>Deleting this transaction will cause an <span class="amount--negative"><strong>OVERDRAFT</strong></span> in your ledger.</p>
    <p>Do you want to continue?</p>`,
    proceedText: 'Delete Anyway',
    proceedTone: 'btn--danger',
  });

  renderOverdraftReview();
  dom.overdraftConfirmOverlay.classList.remove('hidden');
}

export function showOverdraftConfirmation() {
  if (!appState.pendingOverdraftTransaction) return;

  configureOverdraftModal({
    title: 'Overdraft Warning',
    message: `
    <p>This transaction will cause an <span class="amount--negative"><strong>OVERDRAFT</strong></span> in your ledger.</p>
    <p>Do you want to continue?</p>
  `,
    proceedText: 'Proceed',
    proceedTone: 'btn--danger',
  });

  renderOverdraftReview();
  dom.overdraftConfirmOverlay.classList.remove('hidden');
}

export function showPendingOverdraftWarning() {
  if (!appState.pendingRiskTransaction) return;

  const mode = appState.pendingRiskTransaction?.mode;
  const isDelete = mode === 'delete';

  configureOverdraftModal({
    title: isDelete ? 'Pending Overdraft Risk (Delete)' : 'Pending Overdraft Warning',
    message: isDelete
      ? `
      <p>Deleting this pending transaction would cause the projected balance to go negative.</p>
      <p>If remaining transactions post as-is, an overdraft will occur.</p>
    `
      : `
      <p>This pending transaction would cause the projected balance to go negative.</p>
      <p>If it posts before additional funds are added, an overdraft will occur.</p>
    `,
    proceedText: isDelete ? 'Delete Anyway' : 'Save as Pending',
    proceedTone: 'btn--risk',
  });

  renderOverdraftRiskReview();
  dom.overdraftConfirmOverlay.classList.remove('hidden');
}

export function showClearLedgerModal(
  transactionCount,
  postedBalance,
  pendingCount,
  projectedBalance
) {
  dom.clearLedgerSummary.innerHTML = `
    <div class="confirm-details">
      <div><strong>Transactions: </strong><span>${transactionCount}</span></div>
      <div><strong>Posted Balance: </strong><span>${formatCurrency(postedBalance)}</span></div>
      <div><strong>Pending Transactions: </strong><span>${pendingCount}</span></div>
      <div><strong>Projected Balance: </strong><span>${formatCurrency(projectedBalance)}</span></div>
    </div>`;

  dom.clearLedgerOverlay.classList.remove('hidden');
}

function configureOverdraftModal({ title, message, proceedText, proceedTone }) {
  dom.overdraftModalTitle.textContent = title;
  dom.overdraftConfirmMessage.innerHTML = message;
  dom.overdraftProceedBtn.textContent = proceedText;
  dom.overdraftProceedBtn.classList.remove('btn--risk', 'btn--danger');

  if (proceedTone) {
    dom.overdraftProceedBtn.classList.add(proceedTone);
  }
}

export function showImportLedgerConfirmation(currentLedgerSummary, importedLedgerSummary) {
  dom.importLedgerSummary.innerHTML = `
    <div><strong>Current Transactions: </strong><span>${currentLedgerSummary.transactionCount}</span></div>
    <div><strong>Current Projected Balance: </strong><span>${formatCurrency(currentLedgerSummary.projectedBalance)}</span></div>
    <hr />
    <div><strong>Imported Transactions: </strong><span>${importedLedgerSummary.transactionCount}</span></div>
    <div><strong>Imported Projected Balance: </strong><span>${formatCurrency(importedLedgerSummary.projectedBalance)}</span></div>
  `;

  dom.importLedgerOverlay.classList.remove('hidden');
}

export function hideImportLedgerConfirmation() {
  dom.importLedgerOverlay.classList.add('hidden');
  dom.importLedgerSummary.innerHTML = '';
}
