import React from 'react';
import { AssetStatus, MovementType } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'amber' | 'slate' | 'indigo' | 'purple' | 'teal' | 'gray';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'slate', dot = true, className = '' }) => {
  const styles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dot-bg-emerald-500',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80 dot-bg-blue-500',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80 dot-bg-amber-500',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dot-bg-slate-500',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dot-bg-indigo-500',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80 dot-bg-purple-500',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80 dot-bg-teal-500',
    gray: 'bg-gray-100 text-gray-600 border-gray-200 dot-bg-gray-400',
  };

  const dotColors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
    gray: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const AssetStatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
  switch (status) {
    case 'Disponível':
      return <Badge variant="emerald">{status}</Badge>;
    case 'Em uso':
      return <Badge variant="blue">{status}</Badge>;
    case 'Em manutenção':
      return <Badge variant="amber">{status}</Badge>;
    case 'Descartado':
      return <Badge variant="slate">{status}</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
};

export const MovementTypeBadge: React.FC<{ tipo: MovementType }> = ({ tipo }) => {
  switch (tipo) {
    case 'Atribuição':
      return <Badge variant="indigo">{tipo}</Badge>;
    case 'Devolução':
      return <Badge variant="teal">{tipo}</Badge>;
    case 'Transferência':
      return <Badge variant="purple">{tipo}</Badge>;
    default:
      return <Badge variant="slate">{tipo}</Badge>;
  }
};
