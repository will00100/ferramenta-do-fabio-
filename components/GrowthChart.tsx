import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { SimulationRow } from '../types';

interface GrowthChartProps {
  data: SimulationRow[];
  targetBalance?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-300 font-mono mb-2 font-bold">Mês {label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} className="text-sm font-mono" style={{ color: p.color }}>
            {p.name}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const GrowthChart: React.FC<GrowthChartProps> = ({ data, targetBalance }) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorWithdrawal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {targetBalance && (
            <ReferenceLine 
              y={targetBalance} 
              label={{ 
                value: 'META', 
                position: 'right', 
                fill: '#fbbf24', 
                fontSize: 10,
                fontWeight: 'bold'
              }} 
              stroke="#fbbf24" 
              strokeDasharray="4 4" 
              strokeWidth={2}
            />
          )}

          <Area 
            type="monotone" 
            dataKey="endBalance" 
            name="Banca Total"
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};