import { dom } from './dom.js';

export function showToast(message, options = {}) {
  const { actionLabel, onAction, actionTone, valueTone } = options;

  const toast = document.createElement('div');
  const toastMessage = document.createElement('span');

  let hideTimeoutId = null;
  let removeTimeoutId = null;

  toast.classList.add('toast');

  if (actionTone) {
    toast.classList.add(`toast--${actionTone}`);
  }

  if (valueTone) {
    toast.classList.add(`toast--${valueTone}`);
  }

  toastMessage.textContent = message;

  toast.appendChild(toastMessage);

  if (actionLabel && typeof onAction === 'function') {
    const actionButton = document.createElement('button');

    actionButton.type = 'button';
    actionButton.classList.add('action-link-btn', 'toast-action-btn');
    actionButton.textContent = actionLabel;

    actionButton.addEventListener('click', () => {
      clearToastTimers();
      onAction();
      toast.remove();
    });

    toast.appendChild(actionButton);
  }

  function clearToastTimers() {
    clearTimeout(hideTimeoutId);
    clearTimeout(removeTimeoutId);
  }

  function startToastTimers() {
    hideTimeoutId = setTimeout(() => {
      toast.classList.add('toast--hide');

      removeTimeoutId = setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  toast.addEventListener('mouseenter', () => {
    clearToastTimers();
    toast.classList.remove('toast--hide');
  });

  toast.addEventListener('mouseleave', () => {
    clearToastTimers();
    startToastTimers();
  });

  dom.toastContainer.appendChild(toast);
  startToastTimers();
}
