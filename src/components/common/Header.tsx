import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import {
  Building2,
  ChevronDown,
  Search,
  Bell,
  Check,
  ShieldCheck,
  Layers,
  Sparkles,
  Command,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentOrg, organizations, setCurrentOrgId, activeTab, selectedAssetId, assets } = useInventy();
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const currentAsset = selectedAssetId ? assets.find((a) => a.id === selectedAssetId) : null;

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Brand & Organization Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-xs">
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Inventy</span>
            <span className="text-[10px] font-semibold text-slate-400 block leading-none">B2B Asset Manager</span>
          </div>
        </div>

        {/* Multi-Org Switcher */}
        <div className="relative">
          <button
            onClick={() => setOrgMenuOpen(!orgMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 text-slate-800 text-xs font-medium transition-all group"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800" />
            <span className="max-w-[160px] truncate font-semibold text-slate-900">{currentOrg.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600 font-medium">
              {currentOrg.code}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-0.5" />
          </button>

          {/* Org Dropdown Menu */}
          {orgMenuOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Organizações Disponíveis
              </div>
              {organizations.map((org) => {
                const isSelected = org.id === currentOrg.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => {
                      setCurrentOrgId(org.id);
                      setOrgMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-slate-50/80 font-semibold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-3 h-3 text-slate-600" />
                      </div>
                      <div className="truncate">
                        <p className="truncate leading-tight">{org.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{org.cnpj}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Global Quick Search */}
      <div className="hidden md:flex items-center gap-2 max-w-md w-full px-2">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Buscar por patrimônio, número de série, ativo ou colaborador..."
            className="w-full pl-8 pr-12 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </div>
      </div>

      {/* Right: Actions & User Session */}
      <div className="flex items-center gap-2.5">
        <button
          className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notificações & Auditoria"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-1">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
            alt="Carlos Eduardo Silva"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">Carlos Eduardo</p>
            <span className="text-[10px] text-emerald-700 font-medium inline-flex items-center gap-1 leading-none mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Admin T.I.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
