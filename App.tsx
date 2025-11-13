import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Settings, 
  ArrowRight,
  Wallet,
  Target,
  CheckCircle2,
  BarChart3,
  BellRing
} from 'lucide-react';
import { calculateCompoundInterest, formatMoney } from './utils';
import { SimulationParams } from './types';
import { StatCard } from './components/StatCard';
import { ResultsTable } from './components/ResultsTable';
import { GrowthChart } from './components/GrowthChart';
import { ProfitChart } from './components/ProfitChart';
import { EntryCalculator } from './components/EntryCalculator';

const QUOTES = [
  { text: "O juro composto é a oitava maravilha do mundo. Aquele que entende, ganha; aquele que não entende, paga.", author: "Albert Einstein" },
  { text: "Risco vem de você não saber o que está fazendo.", author: "Warren Buffett" },
  { text: "Não trabalhe pelo dinheiro. Faça o dinheiro trabalhar por você.", author: "Robert Kiyosaki" },
  { text: "O mercado de ações é um dispositivo para transferir dinheiro dos impacientes para os pacientes.", author: "Warren Buffett" }
];

function App() {
  // --- State ---
  const [params, setParams] = useState<SimulationParams>({
    initialCapital: 500,
    monthlyContribution: 500,
    monthlyInterestRate: 45,
    withdrawalRate: 50,
    withdrawalStartMonth: 6,
    durationMonths: 12
  });

  const [targetBalance, setTargetBalance] = useState<number>(50000);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showConfigStats, setShowConfigStats] = useState(false);

  // Stats Visibility Configuration
  const [visibleStats, setVisibleStats] = useState({
    finalBalance: true,
    totalWithdrawn: true,
    profit: true,
    invested: true
  });

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Calculations ---
  const data = useMemo(() => calculateCompoundInterest(params), [params]);

  const totals = useMemo(() => {
    const lastRow = data[data.length - 1];
    const totalWithdrawn = data.reduce((acc, row) => acc + row.withdrawal, 0);
    const totalProfit = data.reduce((acc, row) => acc + row.profit, 0);
    const totalContributed = data.reduce((acc, row) => acc + row.contribution, 0);
    
    return {
      finalBalance: lastRow ? lastRow.endBalance : 0,
      totalWithdrawn,
      totalProfit,
      totalContributed,
      roi: totalContributed > 0 ? ((lastRow?.endBalance || 0) - (params.initialCapital + totalContributed)) / (params.initialCapital + totalContributed) * 100 : 0
    };
  }, [data, params.initialCapital]);

  // Goal Detection
  const goalReachedMonth = useMemo(() => {
    const match = data.find(row => row.endBalance >= targetBalance);
    return match ? match.month : null;
  }, [data, targetBalance]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const toggleStat = (key: keyof typeof visibleStats) => {
    setVisibleStats(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 pb-20">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/10">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Trade<span className="text-emerald-400">Vision</span> <span className="text-xs align-top bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded ml-1">PRO</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell (Visual Only) */}
            <div className="relative hidden md:block group cursor-pointer">
              <BellRing className={`w-5 h-5 ${goalReachedMonth ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              {goalReachedMonth && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
              )}
              <div className="absolute right-0 top-8 w-64 p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                <h4 className="text-sm font-semibold text-white mb-1">Notificações</h4>
                {goalReachedMonth ? (
                  <p className="text-xs text-emerald-400">Meta atingida no mês {goalReachedMonth}!</p>
                ) : (
                  <p className="text-xs text-slate-500">Nenhuma meta atingida ainda.</p>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-md"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Goal Notification Banner */}
        {goalReachedMonth && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="bg-emerald-500/20 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide">Objetivo Conquistado!</h3>
              <p className="text-slate-300 text-sm">
                Com os parâmetros atuais, você atingirá sua meta de <span className="text-white font-bold">{formatMoney(targetBalance)}</span> no <span className="text-white font-bold">Mês {goalReachedMonth}</span>.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Controls */}
          <div className={`lg:col-span-3 space-y-6 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm sticky top-24 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Settings className="w-5 h-5" />
                  <h2 className="font-semibold uppercase tracking-wider text-sm">Controles</h2>
                </div>
              </div>

              <div className="space-y-5">
                
                {/* Meta Goal Input */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
                   <label className="block text-xs font-bold text-amber-400 uppercase mb-2">
                    Meta de Banca (Alvo)
                  </label>
                  <div className="relative">
                    <Target className="absolute top-2.5 left-3 w-4 h-4 text-amber-500/70" />
                    <input
                      type="number"
                      value={targetBalance}
                      onChange={(e) => setTargetBalance(Number(e.target.value))}
                      className="block w-full pl-10 pr-3 py-2 bg-slate-900/80 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-white text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Regular Inputs */}
                <div className="group">
                  <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Banca Inicial</label>
                  <input
                    type="number"
                    name="initialCapital"
                    value={params.initialCapital}
                    onChange={handleInputChange}
                    className="input-dark"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Aporte Mensal</label>
                  <input
                    type="number"
                    name="monthlyContribution"
                    value={params.monthlyContribution}
                    onChange={handleInputChange}
                    className="input-dark"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Meta Mensal (%)</label>
                  <input
                    type="number"
                    name="monthlyInterestRate"
                    value={params.monthlyInterestRate}
                    onChange={handleInputChange}
                    className="input-dark"
                  />
                </div>

                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">% Saque do Lucro</label>
                     <span className="text-xs font-mono text-rose-400">{params.withdrawalRate}%</span>
                  </div>
                  <input
                    type="range"
                    name="withdrawalRate"
                    min="0"
                    max="100"
                    value={params.withdrawalRate}
                    onChange={handleInputChange}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Início Saque</label>
                    <input
                      type="number"
                      name="withdrawalStartMonth"
                      value={params.withdrawalStartMonth}
                      onChange={handleInputChange}
                      className="input-dark text-center"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Duração</label>
                    <input
                      type="number"
                      name="durationMonths"
                      min="1"
                      max="60"
                      value={params.durationMonths}
                      onChange={handleInputChange}
                      className="input-dark text-center"
                    />
                  </div>
                </div>

                {/* Widget Customization Toggle */}
                <div className="pt-4 border-t border-slate-700">
                  <button 
                    onClick={() => setShowConfigStats(!showConfigStats)}
                    className="flex items-center justify-between w-full text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <span>Personalizar Dashboard</span>
                    <Settings className="w-3 h-3" />
                  </button>
                  
                  {showConfigStats && (
                    <div className="mt-3 space-y-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={visibleStats.finalBalance}
                          onChange={() => toggleStat('finalBalance')}
                          className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20" 
                        />
                        <span className="text-xs text-slate-400">Banca Final</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={visibleStats.totalWithdrawn}
                          onChange={() => toggleStat('totalWithdrawn')}
                          className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20" 
                        />
                        <span className="text-xs text-slate-400">Total Sacado</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={visibleStats.profit}
                          onChange={() => toggleStat('profit')}
                          className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20" 
                        />
                        <span className="text-xs text-slate-400">Lucro Bruto</span>
                      </label>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Main Content Dashboard */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header Area with Quote */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard de Performance</h1>
                <p className="text-slate-400 text-sm">Visão geral da sua simulação de patrimônio</p>
              </div>
              <div className="hidden md:block max-w-md text-right">
                <p className="text-xs text-slate-500 italic">"{QUOTES[quoteIndex].text}"</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">- {QUOTES[quoteIndex].author}</p>
              </div>
            </div>

            {/* Stats Grid (Customizable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {visibleStats.finalBalance && (
                <StatCard 
                  label="Banca Projetada" 
                  value={formatMoney(totals.finalBalance)}
                  subValue={`ROI: +${totals.roi.toFixed(1)}%`}
                  icon={<TrendingUp size={20} />}
                  highlight={true}
                />
              )}
              {visibleStats.totalWithdrawn && (
                <StatCard 
                  label="Total em Saques" 
                  value={formatMoney(totals.totalWithdrawn)}
                  subValue="Retorno líquido para bolso"
                  icon={<ArrowRight size={20} />}
                />
              )}
              {visibleStats.profit && (
                <StatCard 
                  label="Lucro Operacional" 
                  value={formatMoney(totals.totalProfit)}
                  subValue="Ganhos brutos do período"
                  icon={<PieChart size={20} />}
                />
              )}
              {visibleStats.invested && (
                <StatCard 
                  label="Total Investido" 
                  value={formatMoney(totals.totalContributed + params.initialCapital)}
                  subValue="Capital próprio alocado"
                  icon={<Wallet size={20} />}
                />
              )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5 backdrop-blur-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Evolução Patrimonial
                  </h3>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <GrowthChart data={data} targetBalance={targetBalance} />
                </div>
              </div>

              {/* Profit Chart */}
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5 backdrop-blur-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    Performance Mensal (Lucro vs Saque)
                  </h3>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <ProfitChart data={data} />
                </div>
              </div>
            </div>

            {/* Entry Calculator */}
            <EntryCalculator defaultBalance={params.initialCapital} />

            {/* Detailed Table */}
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-1 backdrop-blur-sm">
               <div className="p-4 border-b border-slate-700/50 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-white">Histórico Detalhado</h3>
               </div>
              <ResultsTable data={data} />
            </div>

          </div>
        </div>
      </main>

      {/* Inline Styles for nicer inputs */}
      <style>{`
        .input-dark {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid rgb(51, 65, 85);
          border-radius: 0.5rem;
          color: white;
          transition: all 0.2s;
        }
        .input-dark:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
}

export default App;
