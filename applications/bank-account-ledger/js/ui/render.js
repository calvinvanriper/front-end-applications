import { dom } from './dom.js';
import { appState } from '../state/app-state.js';
import { categoryLookup, transactionFieldConfig } from '../config/constants.js';
import { formatCurrency, formatFieldValue } from '../utils/formatters.js';

export function renderSummary(myAccount) {
  const pendingTransactions = myAccount.getPendingTransactions();
  const projectedBalance = myAccount.getProjectedBalance();
  const postedBalance = myAccount.getPostedBalance();
  const isLedgerEmpty = myAccount.bankLedger.length === 0;

  updateButtonState(dom.clearLedgerBtn, isLedgerEmpty, 'Ledger Empty', 'Clear Ledger');
  updateButtonState(dom.exportLedgerBtn, isLedgerEmpty, 'Ledger Empty', 'Export Ledger');

  dom.postedBalance.classList.toggle('amount--negative', postedBalance < 0);
  dom.projectedBalance.classList.toggle('amount--negative', projectedBalance < 0);

  dom.transactionCount.textContent = myAccount.bankLedger.length;
  dom.pendingCount.textContent = pendingTransactions.length;
  dom.postedBalance.textContent = formatCurrency(postedBalance);
  dom.projectedBalance.textContent = formatCurrency(projectedBalance);
}

function updateButtonState(button, isEmpty, emptyText, defaultText) {
  button.textContent = isEmpty ? emptyText : defaultText;
  button.disabled = isEmpty;
}

function createTransactionRow(transaction, runningBalance, myAccount) {
  const transactionRow = document.createElement('div');
  const dateEl = document.createElement('p');
  const descriptionEl = document.createElement('p');
  const categoryEl = document.createElement('p');
  const amountEl = document.createElement('p');
  const balanceEl = document.createElement('p');
  const editBtn = document.createElement('button');

  const nextRunningBalance = runningBalance + myAccount.getTransactionSignedAmount(transaction);

  dateEl.textContent = transaction.date;
  descriptionEl.textContent = transaction.description;
  categoryEl.textContent = categoryLookup[transaction.category];

  if (transaction.type === 'withdraw') {
    amountEl.textContent = '-';
  }

  balanceEl.classList.add(nextRunningBalance < 0 ? 'amount--negative' : 'amount--positive');

  amountEl.textContent += formatCurrency(transaction.amount);
  balanceEl.textContent = formatCurrency(nextRunningBalance);

  editBtn.textContent = 'Edit';
  editBtn.type = 'button';
  editBtn.dataset.id = transaction.id;
  editBtn.classList.add('action-link-btn', 'edit-btn');

  dateEl.classList.add('date');
  descriptionEl.classList.add('description');
  categoryEl.classList.add('category');
  balanceEl.classList.add('balance');
  amountEl.classList.add('amount');

  transactionRow.append(dateEl, descriptionEl, categoryEl, amountEl, balanceEl, editBtn);
  transactionRow.classList.add('transaction-row');

  if (transaction.status === 'pending') {
    transactionRow.classList.add('transaction-row--pending');
  }

  return {
    transactionRow,
    nextRunningBalance,
  };
}

function renderTransactionList(transactions, container, startingBalance, myAccount) {
  let runningBalance = startingBalance;

  transactions.forEach((transaction) => {
    const { transactionRow, nextRunningBalance } = createTransactionRow(
      transaction,
      runningBalance,
      myAccount
    );

    runningBalance = nextRunningBalance;
    container.appendChild(transactionRow);
  });
}

export function renderTransactions(myAccount) {
  dom.pendingTransactions.innerHTML = '';
  dom.postedTransactions.innerHTML = '';

  const pendingTransactions = myAccount.getSortedLedger(myAccount.getPendingTransactions());
  const postedTransactions = myAccount.getSortedLedger(myAccount.getPostedTransactions());

  const runningProjectedBalance = myAccount.getPostedBalance();
  const runningPostedBalance = 0;

  if (pendingTransactions.length === 0) {
    dom.pendingLedgerHeader.classList.add('hidden');
    renderEmptyState(dom.pendingTransactions, 'No pending transactions');
  } else {
    dom.pendingLedgerHeader.classList.remove('hidden');
    renderTransactionList(
      pendingTransactions,
      dom.pendingTransactions,
      runningProjectedBalance,
      myAccount
    );
  }

  if (postedTransactions.length === 0) {
    dom.postedLedgerHeader.classList.add('hidden');
    renderEmptyState(dom.postedTransactions, 'No posted transactions');
  } else {
    dom.postedLedgerHeader.classList.remove('hidden');
    renderTransactionList(
      postedTransactions,
      dom.postedTransactions,
      runningPostedBalance,
      myAccount
    );
  }
}

function renderEmptyState(container, message) {
  const emptyState = document.createElement('p');
  emptyState.classList.add('ledger-empty-state');
  emptyState.textContent = message;
  container.appendChild(emptyState);
}

export function renderOverdraftReview() {
  renderOverdraftReviewFromState(appState.pendingOverdraftTransaction);
}
export function renderOverdraftRiskReview() {
  renderOverdraftReviewFromState(appState.pendingRiskTransaction);
}

export function renderDiscardReview(currentState) {
  const originalState = appState.initialFormState;

  dom.discardReviewContents.innerHTML = '';

  transactionFieldConfig.forEach(({ key, label }) => {
    const originalValue = formatFieldValue(key, originalState[key]);
    const currentValue = formatFieldValue(key, currentState[key]);

    const isChanged = originalValue !== currentValue;

    const row = document.createElement('div');
    const rowLabel = document.createElement('span');
    const rowOriginal = document.createElement('span');
    const rowCurrent = document.createElement('span');

    row.classList.add('discard-review-row');
    rowLabel.classList.add('discard-review-label');
    rowOriginal.classList.add('discard-review-original');
    rowCurrent.classList.add('discard-review-current');

    if (isChanged) {
      rowCurrent.classList.add('discard-review-current--changed');
    }

    rowLabel.textContent = label;
    rowOriginal.textContent = originalValue;
    rowCurrent.textContent = currentValue;

    row.append(rowLabel, rowOriginal, rowCurrent);
    dom.discardReviewContents.appendChild(row);
  });
}

function renderOverdraftReviewFromState(reviewState) {
  if (!reviewState) return;

  dom.overdraftReviewContents.innerHTML = '';

  const { mode, currentBalance, projectedBalance, finalBalance } = reviewState;

  let displayedTransaction = reviewState.overdraftTransaction;

  if (!displayedTransaction) {
    if (mode === 'create') {
      displayedTransaction = reviewState.transaction;
    }

    if (mode === 'edit') {
      displayedTransaction = reviewState.updatedTransaction;
    }

    if (mode === 'delete') {
      displayedTransaction = reviewState.originalTransaction;
    }
  }

  const row = document.createElement('div');
  const rowAmount = document.createElement('p');
  const rowCurrent = document.createElement('p');
  const rowProjected = document.createElement('p');

  row.classList.add('overdraft-review-row');
  rowAmount.classList.add('overdraft-review-amount');
  rowCurrent.classList.add('overdraft-review-current');
  rowProjected.classList.add('overdraft-review-projected');

  if (projectedBalance < 0) {
    rowProjected.classList.add('amount--negative');
  }

  dom.overdraftContextDate.textContent = displayedTransaction.date;
  dom.overdraftContextDescription.textContent = displayedTransaction.description;

  rowAmount.textContent = formatCurrency(displayedTransaction.amount);
  rowCurrent.textContent = formatCurrency(currentBalance);
  rowProjected.textContent = formatCurrency(projectedBalance);

  row.append(rowAmount, rowCurrent, rowProjected);
  dom.overdraftReviewContents.appendChild(row);

  if (finalBalance < 0 && finalBalance !== projectedBalance) {
    const finalRow = document.createElement('div');
    const finalLabel = document.createElement('span');
    const finalValue = document.createElement('span');

    finalRow.classList.add('overdraft-final-row');
    finalLabel.classList.add('overdraft-final-label');
    finalValue.classList.add('overdraft-final-value', 'amount--negative');

    finalLabel.textContents = 'Ending Balance';
    finalLabel.textContents = formatCurrency(finalBalance);

    finalRow.append(finalLabel, finalValue);
    dom.overdraftReviewContents.appendChild(finalRow);
  }
}
