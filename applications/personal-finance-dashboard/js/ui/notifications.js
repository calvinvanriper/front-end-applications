import { toastMessages } from '../config/constants.js';
import { dom } from './dom.js';

const TOAST_DURATION_MS = 3000;
const TOAST_EXIT_DURATION_MS = 300;

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
    }, TOAST_EXIT_DURATION_MS);
  }, TOAST_DURATION_MS);
}

export function showResultToast(result) {
  if (!result) return;

  const messageType = result.success ? 'success' : 'error';

  showToast(messageType, result.reason);
}
