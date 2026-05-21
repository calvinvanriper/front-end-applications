export class SavingsGoals {
  constructor(goals = []) {
    this.goals = goals;
  }

  // ------------------------------------------------------------
  // --------------------------Getters---------------------------
  // ------------------------------------------------------------

  getGoals() {
    return this.goals;
  }

  // ------------------------------------------------------------
  // ----------------------Goal Management-----------------------
  // ------------------------------------------------------------

  addGoal(goal) {
    this.goals.push(goal);

    return {
      success: true,
      reason: 'goalAdded',
    };
  }

  removeGoal(goalId) {
    const initialLength = this.goals.length;

    this.goals = this.goals.filter((goal) => goal.id !== goalId);

    if (this.goals.length === initialLength) {
      return {
        success: false,
        reason: 'goalNotFound',
      };
    }

    return {
      success: true,
      reason: 'goalRemoved',
    };
  }

  clearGoals() {
    if (this.goals.length === 0) {
      return {
        success: false,
        reason: 'emptyGoalsList',
      };
    }

    this.goals = [];

    return {
      success: true,
      reason: 'goalsCleared',
    };
  }

  replaceGoals(goals) {
    this.goals = goals;

    return {
      success: true,
      reason: 'goalsReplaced',
    };
  }

  updateGoal(goalId, updatedGoalData) {
    const goalIndex = this.goals.findIndex((goal) => goal.id === goalId);

    if (goalIndex === -1) {
      return {
        success: false,
        reason: 'goalNotFound',
      };
    }

    this.goals[goalIndex] = {
      ...this.goals[goalIndex],
      ...updatedGoalData,
    };

    return {
      success: true,
      reason: 'goalUpdated',
    };
  }
}
