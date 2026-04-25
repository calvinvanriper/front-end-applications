const STORAGE_KEY = 'bank-account-ledger';

function isValidStoredTransaction(transaction) {
  return (
    transaction &&
    typeof transaction.id === 'string' &&
    typeof transaction.date === 'string' &&
    (transaction.type === 'deposit' || transaction.type === 'withdraw') &&
    typeof transaction.description === 'string' &&
    typeof transaction.category === 'string' &&
    typeof transaction.amount === 'number' &&
    typeof transaction.sequence === 'number'
  );
}

function normalizeStoredTransactionStatus(transaction) {
  return transaction.status === 'pending' || transaction.status === 'posted'
    ? transaction.status
    : 'posted';
}

export function saveLedgerToStorage(ledger) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  } catch (error) {
    console.error('Unable to save ledger data', error);
  }
}

export function clearLedgerFromStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadLedgerFromStorage() {
  const storedLedger = localStorage.getItem(STORAGE_KEY);

  if (!storedLedger) {
    return [];
  }

  try {
    const parsedLedger = JSON.parse(storedLedger);

    if (!Array.isArray(parsedLedger)) {
      return [];
    }

    return parsedLedger.filter(isValidStoredTransaction).map((transaction) => ({
      ...transaction,
      status: normalizeStoredTransactionStatus(transaction),
    }));
  } catch (error) {
    console.error('Unable to parse stored ledger data.', error);
    return [];
  }
}

export function createLedgerBackupJson(ledger) {
  return JSON.stringify(
    {
      app: 'bank-account-ledger',
      version: 1,
      exportedAt: new Date().toISOString(),
      ledger,
    },
    null,
    2
  );
}

export async function downloadLedgerBackup(ledger) {
  const backupJson = createLedgerBackupJson(ledger);
  const fileName = `bank-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`;

  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(backupJson);
      await writable.close();

      return;
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Unable to save ledger backup with file picker.', error);
    }
  }

  const blob = new Blob([backupJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `bank-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`;

  downloadLink.click();

  URL.revokeObjectURL(url);
}

export async function readLedgerBackupFile(file) {
  const text = await file.text();

  try {
    const parsed = JSON.parse(text);

    if (!parsed || !Array.isArray(parsed.ledger)) {
      throw new Error('Invalid backup format');
    }

    return parsed.ledger;
  } catch (error) {
    console.error('Invalid backup file.', error);
    return null;
  }
}
