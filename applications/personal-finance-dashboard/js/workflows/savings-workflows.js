import { renderSavingsGoalsSection } from '../ui/render.js';
import { saveSavingsGoalsCache } from '../storage/persistence.js';
import { validateGoalData } from '../utils/validators.js';

export function processGoalFormSubmit(savingsGoals, goalData) {
  const validationResult = validateGoalData(goalData);

  if (!validationResult.success) {
    return validationResult;
  }

  const goal = {
    id: crypto.randomUUID(),
    ...goalData,
    createdAt: new Date().toISOString(),
  };

  return processGoalAdd(savingsGoals, goal);
}

export function processGoalAdd(savingsGoals, goal) {
  const result = savingsGoals.addGoal(goal);

  if (result.success) {
    syncSavingsGoalsUI(savingsGoals);
  }

  return result;
}

export function processGoalUpdate(savingsGoals, goalId, updatedGoalData) {
  const validationResult = validateGoalData(updatedGoalData);

  if (!validationResult.success) {
    return validationResult;
  }

  const result = savingsGoals.updateGoal(goalId, updatedGoalData);

  if (!result.success) {
    return result;
  }

  syncSavingsGoalsUI(savingsGoals);

  return result;
}

export function processGoalRemove(savingsGoals, goalId) {
  const result = savingsGoals.removeGoal(goalId);

  if (result.success) {
    syncSavingsGoalsUI(savingsGoals);
  }

  return result;
}

export function processGoalsClear(savingsGoals) {
  const result = savingsGoals.clearGoals();

  if (result.success) {
    syncSavingsGoalsUI(savingsGoals);
  }

  return result;
}

function syncSavingsGoalsUI(savingsGoals) {
  const goals = savingsGoals.getGoals();

  saveSavingsGoalsCache(goals);
  renderSavingsGoalsSection(goals);
}
