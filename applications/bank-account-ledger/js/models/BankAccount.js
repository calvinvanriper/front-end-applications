export class BankAccount {
  constructor() {
    this.bankLedger = [];
  }

  isValidAmount(amount) {
    return typeof amount === 'number' && !Number.isNaN(amount) && amount > 0;
  }

  wouldWithdrawalExceedPostedBalance(amount) {
    return amount > this.getPostedBalance();
  }

  getNextSequence() {
    return Math.max(0, ...this.bankLedger.map((transaction) => transaction.sequence ?? 0)) + 1;
  }

  getTransactionSignedAmount(transaction) {
    if (transaction.type === 'deposit') {
      return transaction.amount;
    }

    if (transaction.type === 'withdraw') {
      return -transaction.amount;
    }

    return 0;
  }

  getLedgerBalance(ledger) {
    return ledger.reduce((total, transaction) => {
      return total + this.getTransactionSignedAmount(transaction);
    }, 0);
  }

  getSortedLedger(ledger) {
    return [...ledger].sort((firstTransaction, secondTransaction) => {
      return this.compareTransactionsByDateAndSequence(firstTransaction, secondTransaction);
    });
  }

  postToLedger(transaction, options = {}) {
    if (!this.isValidAmount(transaction.amount)) {
      return { success: false, reason: 'invalidAmount' };
    }

    if (transaction.type !== 'deposit' && transaction.type !== 'withdraw') {
      return { success: false, reason: 'invalidType' };
    }

    if (transaction.sequence === null) {
      transaction.sequence = this.getNextSequence();
    }

    this.bankLedger.push(transaction);

    if (transaction.status === 'pending') {
      return {
        success: true,
        reason: transaction.type === 'deposit' ? 'depositPending' : 'withdrawPending',
      };
    }

    if (transaction.type === 'deposit') {
      return { success: true, reason: 'depositPosted' };
    }

    return {
      success: true,
      reason: options.isOverdraftApproved ? 'overdraftPosted' : 'withdrawPosted',
    };
  }

  getTransactionIndex(ledger, transactionId) {
    return ledger.findIndex((transaction) => {
      return transaction.id === transactionId;
    });
  }

  getBalanceBeforeTransaction(transactionId) {
    const sortedLedger = this.getSortedLedger(this.bankLedger);
    const transactionIndex = this.getTransactionIndex(sortedLedger, transactionId);

    if (transactionIndex === -1) {
      return 0;
    }

    return this.getLedgerBalance(sortedLedger.slice(0, transactionIndex));
  }

  compareTransactionsByDateAndSequence(firstTransaction, secondTransaction) {
    if (firstTransaction.date !== secondTransaction.date) {
      return firstTransaction.date.localeCompare(secondTransaction.date);
    }

    return firstTransaction.sequence - secondTransaction.sequence;
  }

  sortLedgerByDate() {
    this.bankLedger.sort((firstTransaction, secondTransaction) => {
      return this.compareTransactionsByDateAndSequence(firstTransaction, secondTransaction);
    });
  }

  getProjectedBalanceForTransaction(candidateTransaction) {
    const projectedLedger = this.getSortedLedger([
      ...this.getPostedTransactions(),
      candidateTransaction,
    ]);

    const transactionIndex = this.getTransactionIndex(projectedLedger, candidateTransaction.id);

    const overdraftAnalysis = this.getFirstOverdraftInLedger(projectedLedger, transactionIndex);

    return {
      projectedLedger,
      ...overdraftAnalysis,
    };
  }

  getProjectedRiskForPendingTransaction(candidateTransaction) {
    return this.getProjectedRiskAnalysis(
      [...this.bankLedger, candidateTransaction],
      candidateTransaction.id
    );
  }

  getProjectedLedgerForEdit(originalTransactionId, updatedValues) {
    const originalTransaction = this.bankLedger.find((transaction) => {
      return transaction.id === originalTransactionId;
    });

    const originalTransactionIndex = this.getTransactionIndex(
      this.bankLedger,
      originalTransactionId
    );

    if (!originalTransaction) return null;

    const updatedStatus =
      updatedValues.status === 'pending' || updatedValues.status === 'posted'
        ? updatedValues.status
        : originalTransaction.status;

    if (originalTransaction.status === 'posted' && updatedStatus === 'pending') {
      return null;
    }

    const isPostingPendingTransaction =
      originalTransaction.status === 'pending' && updatedStatus === 'posted';

    let updatedTransactionSequence = originalTransaction.sequence;

    if (updatedValues.date !== originalTransaction.date || isPostingPendingTransaction) {
      updatedTransactionSequence = this.getNextSequence();
    }

    const updatedTransaction = {
      id: originalTransactionId,
      date: updatedValues.date,
      type: updatedValues.type,
      category: updatedValues.category,
      description: updatedValues.description,
      amount: updatedValues.amount,
      sequence: updatedTransactionSequence,
      status: updatedStatus,
    };

    const projectedLedger = this.getSortedLedger(
      this.getLedgerWithoutTransaction(originalTransactionId).concat(updatedTransaction)
    );

    const transactionIndex = this.getTransactionIndex(projectedLedger, updatedTransaction.id);

    const safeOriginalIndex = originalTransactionIndex === -1 ? 0 : originalTransactionIndex;
    const safeNewIndex = transactionIndex === -1 ? 0 : transactionIndex;
    const overdraftStartIndex = Math.min(safeOriginalIndex, safeNewIndex);
    return {
      projectedLedger,
      updatedTransaction,
      overdraftStartIndex,
    };
  }

  getFirstOverdraftInLedger(projectedLedger, startIndex = 0) {
    let runningBalance = 0;
    let overdraftTransaction = null;
    let balanceBeforeTransaction = 0;
    let runningBalanceAtTransaction = 0;

    for (let i = 0; i < projectedLedger.length; i++) {
      const transaction = projectedLedger[i];
      const balanceBefore = runningBalance;

      runningBalance += this.getTransactionSignedAmount(transaction);

      if (i >= startIndex && runningBalance < 0 && overdraftTransaction === null) {
        overdraftTransaction = transaction;
        balanceBeforeTransaction = balanceBefore;
        runningBalanceAtTransaction = runningBalance;
      }
    }

    return {
      hasOverdraft: overdraftTransaction !== null,
      overdraftTransaction,
      balanceBeforeTransaction,
      runningBalanceAtTransaction,
      finalBalance: runningBalance,
    };
  }

  getProjectedLedgerForDelete(transactionId) {
    const transactionIndex = this.getTransactionIndex(this.bankLedger, transactionId);

    if (transactionIndex === -1) {
      return {
        projectedLedger: [],
        transactionIndex: -1,
      };
    }

    const projectedLedger = this.getSortedLedger(this.getLedgerWithoutTransaction(transactionId));

    return {
      projectedLedger,
      transactionIndex,
    };
  }

  getProjectedRiskForPendingEdit(originalTransactionId, updatedTransaction) {
    return this.getProjectedRiskAnalysis(
      this.getLedgerWithoutTransaction(originalTransactionId).concat(updatedTransaction),
      updatedTransaction.id
    );
  }

  getProjectedRiskAnalysis(projectedLedger, transactionId) {
    const sortedProjectedLedger = this.getSortedLedger(projectedLedger);
    const transactionIndex = this.getTransactionIndex(sortedProjectedLedger, transactionId);
    const riskAnalysis = this.getFirstOverdraftInLedger(sortedProjectedLedger, transactionIndex);

    return {
      projectedLedger: sortedProjectedLedger,
      ...riskAnalysis,
    };
  }

  removeTransactionById(transactionId) {
    this.bankLedger = this.bankLedger.filter((transaction) => {
      return transaction.id !== transactionId;
    });
  }

  getLedgerWithoutTransaction(transactionId, ledger = this.bankLedger) {
    return ledger.filter((transaction) => transaction.id !== transactionId);
  }

  getTransactionsByStatus(status) {
    return this.bankLedger.filter((transaction) => transaction.status === status);
  }

  getPostedTransactions() {
    return this.getTransactionsByStatus('posted');
  }

  getPendingTransactions() {
    return this.getTransactionsByStatus('pending');
  }

  getPostedBalance() {
    return this.getLedgerBalance(this.getPostedTransactions());
  }

  getProjectedBalance() {
    return this.getLedgerBalance(this.bankLedger);
  }
}
