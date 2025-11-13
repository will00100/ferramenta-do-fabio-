import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, highlight = false }) => {
  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
      highlight 
        ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
        : 'bg-slate-800/40 border-slate-700/50'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</h3>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <div className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${highlight ? 'text-white' : 'text-slate-100'}`}>
          {value}
        </div>
        {subValue && (
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};