import { dom } from './dom.js';

export function showConfirmationModal({ title, message, confirmText = 'Confirm' }) {
  dom.confirmationTitle.textContent = title;
  dom.confirmationMessage.innerHTML = message;
  dom.confirmActionBtn.textContent = confirmText;

  dom.confirmationModal.classList.remove('hidden');
}

export function hideConfirmationModal() {
  dom.confirmationModal.classList.add('hidden');
}
