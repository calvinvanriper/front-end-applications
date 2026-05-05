import { toastMessages } from '../config/constants.js';
import { dom } from './dom.js';

function showToast(messageType, messageKey) {
  const message = toastMessages[messageType]?.[messageKey];

  if (!message) return;

  const toast = document.createElement('div');
  toast.classList.add('toast', `toast--${messageType}`);
  toast.textContent = message;

  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

export function showResultToast(result) {
  if (!result) return;

  const messageType = result.success ? 'success' : 'errors';

  showToast(messageType, result.reason);
}
