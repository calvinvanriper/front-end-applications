import { dom } from './dom.js';
import { appState } from '../state/app-state.js';
import { categories } from '../config/constants.js';

export function showAmountError(message) {
  dom.transactionAmount.classList.add('input-error');
  showFormMessage(message);
}

export function hideTransactionForm() {
  dom.overlay.classList.add('hidden');
  resetForm();
  clearAmountError();
}

export function hasUnsavedChanges() {
  if (!appState.initialFormState) return false;

  const currentFormState = getFormState();

  return JSON.stringify(currentFormState) !== JSON.stringify(appState.initialFormState);
}

export function showTransactionForm() {
  if (!appState.editingTransactionId) {
    resetForm();
  }

  setDefaultDate();
  updateFormMode();
  dom.overlay.classList.remove('hidden');
}

export function openCreateTransactionForm() {
  appState.editingTransactionId = null;
  resetForm();
  updateFormMode();
  dom.overlay.classList.remove('hidden');
  appState.initialFormState = getFormState();
}

export function populateTransactionForm(transaction) {
  dom.transactionDate.value = transaction.date;
  dom.transactionDescription.value = transaction.description;
  dom.transactionAmount.value = transaction.amount;

  const selectedTypeInput = [...dom.typeInputs].find((input) => {
    return input.value === transaction.type;
  });

  if (selectedTypeInput) {
    selectedTypeInput.checked = true;
  }

  if (dom.postedStatusInput) {
    dom.postedStatusInput.checked = transaction.status === 'posted';
  }

  if (dom.pendingStatusInput) {
    dom.pendingStatusInput.checked = transaction.status === 'pending';
    dom.pendingStatusInput.disabled = transaction.status === 'posted';
  }

  updateCategoryOptions(transaction.type);
  dom.transactionCategory.value = transaction.category;
}

export function getFormState() {
  const selectedType = [...dom.typeInputs].find((input) => input.checked);
  const selectedStatus = [...dom.statusInputs].find((input) => input.checked);

  return {
    date: dom.transactionDate.value,
    type: selectedType ? selectedType.value : null,
    status: selectedStatus ? selectedStatus.value : null,
    category: dom.transactionCategory.value,
    description: dom.transactionDescription.value,
    amount: dom.transactionAmount.value,
  };
}

export function updateCategoryOptions(type) {
  dom.transactionCategory.innerHTML = '<option value="">--Please choose a category--</option>';

  if (!type || !categories[type]) return;

  categories[type].forEach((category) => {
    const option = document.createElement('option');

    option.value = category.value;
    option.textContent = category.label;

    dom.transactionCategory.appendChild(option);
  });
}

export function showFormMessage(message) {
  dom.formMessage.textContent = message;
  dom.formMessage.classList.remove('hidden');
}

export function clearAmountError() {
  dom.transactionAmount.classList.remove('input-error');
  hideFormMessage();
}

function hideFormMessage() {
  dom.formMessage.textContent = '';
  dom.formMessage.classList.add('hidden');
}

function resetForm() {
  dom.form.reset();
  setDefaultDate();
  dom.transactionCategory.innerHTML = '<option value="">--Please choose a category--</option>';

  if (dom.pendingStatusInput) {
    dom.pendingStatusInput.disabled = false;
  }

  appState.editingTransactionId = null;
  updateFormMode();
}

function updateFormMode() {
  if (appState.editingTransactionId) {
    dom.transactionFormTitle.textContent = 'Edit Transaction';
    dom.submitBtn.textContent = 'Save Changes';
    dom.deleteBtn.classList.remove('hidden');
    return;
  }

  dom.transactionFormTitle.textContent = 'Enter New Transaction';
  dom.submitBtn.textContent = 'Add Transaction';
  dom.deleteBtn.classList.add('hidden');
}

function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  dom.transactionDate.value = today;
}
