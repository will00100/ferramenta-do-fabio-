import { SimulationParams, SimulationRow } from './types';

export const calculateCompoundInterest = (params: SimulationParams): SimulationRow[] => {
  const rows: SimulationRow[] = [];
  let currentBalance = params.initialCapital;

  for (let month = 1; month <= params.durationMonths; month++) {
    // 1. Add Monthly Contribution (Aporte) at the start of the period (before profit calculation)
    // Logic assumption based on PDF M1->M2 transition: (725 end M1 + 500 aporte = 1225 start M2)
    // Exception: Month 1 usually starts with just the capital. 
    // If the user says "Initial Capital 500" and "Monthly Contribution 500", 
    // does Month 1 start with 1000? Usually "Initial" is what you have NOW. 
    // "Monthly Contribution" is added for subsequent months.
    
    const contribution = month === 1 ? 0 : params.monthlyContribution;
    const totalInvested = currentBalance + contribution;

    // 2. Calculate Profit
    const profit = totalInvested * (params.monthlyInterestRate / 100);

    // 3. Calculate Total before withdrawal
    const totalAfterProfit = totalInvested + profit;

    // 4. Calculate Withdrawal
    let withdrawal = 0;
    if (month >= params.withdrawalStartMonth) {
      withdrawal = profit * (params.withdrawalRate / 100);
    }

    // 5. Final Balance
    const endBalance = totalAfterProfit - withdrawal;

    rows.push({
      month,
      startBalance: currentBalance,
      contribution,
      totalInvested,
      profit,
      totalAfterProfit,
      withdrawal,
      endBalance
    });

    // Set up next month
    currentBalance = endBalance;
  }

  return rows;
};

export const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};