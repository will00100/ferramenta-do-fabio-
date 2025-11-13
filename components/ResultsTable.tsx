import React from 'react';
import { SimulationRow } from '../types';

interface ResultsTableProps {
  data: SimulationRow[];
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Mês</th>
              <th className="px-6 py-4 font-semibold text-right">Banca Inicial</th>
              <th className="px-6 py-4 font-semibold text-right text-blue-400">Aporte</th>
              <th className="px-6 py-4 font-semibold text-right text-emerald-400">Lucro</th>
              <th className="px-6 py-4 font-semibold text-right text-rose-400">Retirada</th>
              <th className="px-6 py-4 font-semibold text-right text-white">Banca Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.map((row) => (
              <tr key={row.month} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-300">#{row.month.toString().padStart(2, '0')}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-400">{formatCurrency(row.startBalance)}</td>
                <td className="px-6 py-4 text-right font-mono text-blue-400/90">
                  {row.contribution > 0 ? `+ ${formatCurrency(row.contribution)}` : '-'}
                </td>
                <td className="px-6 py-4 text-right font-mono text-emerald-400">
                  {formatCurrency(row.profit)}
                </td>
                <td className="px-6 py-4 text-right font-mono text-rose-400">
                  {row.withdrawal > 0 ? `- ${formatCurrency(row.withdrawal)}` : '-'}
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-white shadow-[inset_2px_0_0_0_rgba(16,185,129,0.5)]">
                  {formatCurrency(row.endBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};