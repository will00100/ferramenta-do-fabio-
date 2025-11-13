import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { SimulationRow } from '../types';

interface ProfitChartProps {
  data: SimulationRow[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-300 font-mono mb-2 font-bold">Mês {label}</p>
        {payload.map((p: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <p className="text-sm font-mono text-slate-200">
              {p.name}: <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.value)}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 0,
          }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="month" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', { notation: "compact", compactDisplay: "short" }).format(value)
            }
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Bar 
            dataKey="profit" 
            name="Lucro Mensal" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
          <Bar 
            dataKey="withdrawal" 
            name="Retirada (Saque)" 
            fill="#f43f5e" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};