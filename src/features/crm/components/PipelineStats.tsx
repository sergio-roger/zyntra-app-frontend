import React from 'react';
import { Users, DollarSign, Trophy, Target, Clock } from 'lucide-react';
import { Contact } from '@crm/types/crm';

interface PipelineStatsProps {
  kanbanData: Record<string, Contact[]>;
}

export const PipelineStats: React.FC<PipelineStatsProps> = ({ kanbanData }) => {
  const allContacts = Object.values(kanbanData).flat();
  
  const totalOpportunities = allContacts.length;
  const totalValue = allContacts.reduce((sum, c) => sum + Number(c.dealValue || 0), 0);
  
  const wonContacts = kanbanData['customer'] || [];
  const wonValue = wonContacts.reduce((sum, c) => sum + Number(c.dealValue || 0), 0);
  
  const conversionRate = totalOpportunities > 0 
    ? Math.round((wonContacts.length / totalOpportunities) * 100) 
    : 0;

  const stats = [
    {
      label: 'Oportunidades',
      value: totalOpportunities,
      subValue: '+ 12%',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Valor total',
      value: `$${totalValue.toLocaleString()}`,
      subValue: '+ 8%',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Valor ganado',
      value: `$${wonValue.toLocaleString()}`,
      subValue: '+ 15%',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Tasa de conversión',
      value: `${conversionRate}%`,
      subValue: '+ 3%',
      icon: Target,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
    {
      label: 'Tiempo promedio',
      value: '23 días',
      subValue: '- 5%',
      icon: Clock,
      color: 'text-slate-400',
      bg: 'bg-slate-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className={`rounded-lg ${stat.bg} p-2 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <span className={`text-xs font-medium ${stat.subValue.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stat.subValue}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-[10px] text-slate-500 italic">vs. mes anterior</p>
        </div>
      ))}
    </div>
  );
};
