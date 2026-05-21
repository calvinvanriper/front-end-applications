export function validateGoalData(goalData) {
  if (!goalData.name?.trim()) {
    return {
      success: false,
      reason: 'invalidGoalName',
    };
  }

  if (Number.isNaN(goalData.targetAmount) || goalData.targetAmount <= 0) {
    return {
      success: false,
      reason: 'invalidGoalTargetAmount',
    };
  }

  if (Number.isNaN(goalData.currentAmount) || goalData.currentAmount < 0) {
    return {
      success: false,
      reason: 'invalidGoalCurrentAmount',
    };
  }

  return {
    success: true,
    reason: 'validGoalData',
  };
}
