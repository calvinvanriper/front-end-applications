// ------------------------------------------------------------
// ------------------Shared Direction Helpers------------------
// ------------------------------------------------------------

export function getChangeDirection(change) {
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
}

// ------------------------------------------------------------
// -----------------Savings Goals Calculations-----------------
// ------------------------------------------------------------

export function calculateGoalProgress(currentAmount, targetAmount) {
  if (!targetAmount || targetAmount <= 0) return 0;

  return Math.min((currentAmount / targetAmount) * 100, 100);
}
