export interface SimulationRow {
  month: number;
  startBalance: number;
  contribution: number;
  totalInvested: number; // startBalance + contribution
  profit: number;
  totalAfterProfit: number;
  withdrawal: number;
  endBalance: number;
}

export interface SimulationParams {
  initialCapital: number;
  monthlyContribution: number;
  monthlyInterestRate: number;
  withdrawalRate: number; // Percentage of profit to withdraw
  withdrawalStartMonth: number;
  durationMonths: number;
}