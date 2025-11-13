import React, { useState, useEffect } from 'react';
import { Calculator, ShieldAlert, TrendingUp, RefreshCw, Percent } from 'lucide-react';

interface EntryCalculatorProps {
  defaultBalance: number;
}

export const EntryCalculator: React.FC<EntryCalculatorProps> = ({ defaultBalance }) => {
  const [balance, setBalance] = useState(defaultBalance);
  const [riskPercentage, setRiskPercentage] = useState(2);
  const [payout, setPayout] = useState(87);

  // Update local balance if default changes, but only if user hasn't typed extensively? 
  // Actually, better to just respect the prop initially or let user override.
  useEffect(() => {
    setBalance(defaultBalance);
  }, [defaultBalance]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const entryValue = balance * (riskPercentage / 100);
  const potentialProfit = entryValue * (payout / 100);
  
  // Martingale Logic (Factor 2.0 standard, could be adjustable but keeping simple)
  const gale1 = entryValue * 2;
  const gale2 = gale1 * 2;

  // Soros Logic
  const sorosHand1 = entryValue;
  const sorosHand1Profit = sorosHand1 * (payout / 100);
  const sorosHand2 = sorosHand1 + sorosHand1Profit;
  const sorosHand2Profit = sorosHand2 * (payout / 100);
  const sorosTotalProfit = sorosHand1Profit + sorosHand2Profit;

  return (
    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Calculator className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Calculadora de Entradas</h3>
          <p className="text-xs text-slate-400">Planejamento operacional diário</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Banca Atual</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-sm">R$</span>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="block w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Risco (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 w-3 h-3 text-slate-500" />
                <input
                  type="number"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(Number(e.target.value))}
                  className="block w-full pl-8 pr-2 py-2 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Payout (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 w-3 h-3 text-slate-500" />
                <input
                  type="number"
                  value={payout}
                  onChange={(e) => setPayout(Number(e.target.value))}
                  className="block w-full pl-8 pr-2 py-2 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Result */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calculator size={64} />
            </div>
            <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider">Valor da Entrada</span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-white font-mono">{formatCurrency(entryValue)}</span>
              <p className="text-xs text-indigo-300/80 mt-1">Lucro Potencial: {formatCurrency(potentialProfit)}</p>
            </div>
          </div>

           <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col justify-center space-y-3">
             <div className="flex justify-between items-center text-sm">
               <span className="text-slate-400">Stop Loss (Diário)</span>
               <span className="text-rose-400 font-mono font-bold">-{formatCurrency(entryValue * 2)}</span>
             </div>
             <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
               <div className="bg-rose-500 h-full w-1/3"></div>
             </div>
             <div className="flex justify-between items-center text-sm">
               <span className="text-slate-400">Stop Win (Meta)</span>
               <span className="text-emerald-400 font-mono font-bold">+{formatCurrency(entryValue * 3)}</span>
             </div>
             <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full w-2/3"></div>
             </div>
           </div>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Martingale Strategy */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-slate-200">Proteção (Martingale)</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase">Gale 1 (2x)</span>
              <span className="text-amber-400 font-mono font-bold">{formatCurrency(gale1)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase">Gale 2 (4x)</span>
              <span className="text-amber-400 font-mono font-bold">{formatCurrency(gale2)}</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 text-center">
              *Cuidado: Martingale aumenta exponencialmente o risco.
            </div>
          </div>
        </div>

        {/* Soros Strategy */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-slate-200">Alavancagem (Soros Nível 2)</h4>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase">Mão 1 (Entrada)</span>
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(sorosHand1)}</span>
            </div>
             <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase">Mão 2 (Lucro + Entrada)</span>
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(sorosHand2)}</span>
            </div>
             <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase">Lucro Total Projetado</span>
              <span className="text-sm text-emerald-300 font-mono font-bold">{formatCurrency(sorosTotalProfit)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
