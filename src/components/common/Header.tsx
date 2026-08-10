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
  Command,
  Menu,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentOrg,
    organizations,
    setCurrentOrgId,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useInventy();

  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-neutral-200/80 px-3 sm:px-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Hamburger (Mobile) + Brand & Org Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-neutral-200/80 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0">
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-neutral-900 tracking-tight leading-none block">Inventy</span>
            <span className="text-[10px] font-semibold text-neutral-400 block leading-none mt-0.5">
              Gestão Patrimonial
            </span>
          </div>
        </div>

        {/* Multi-Org Switcher */}
        <div className="relative min-w-0">
          <button
            onClick={() => setOrgMenuOpen(!orgMenuOpen)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50/80 hover:bg-neutral-100 text-neutral-800 text-xs font-medium transition-all group max-w-[140px] sm:max-w-[200px] truncate cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-800 shrink-0" />
            <span className="truncate font-semibold text-neutral-900 text-xs">{currentOrg.name}</span>
            <span className="hidden lg:inline-block text-[10px] px-1.5 py-0.2 rounded bg-neutral-200/70 text-neutral-600 font-medium">
              {currentOrg.code}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 ml-0.5 shrink-0" />
          </button>

          {/* Org Dropdown Menu */}
          {orgMenuOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-60 sm:w-64 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 border-b border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
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
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-neutral-50/90 font-semibold text-neutral-900' : 'text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-3 h-3 text-neutral-600" />
                      </div>
                      <div className="truncate">
                        <p className="truncate leading-tight font-medium text-neutral-900">{org.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{org.cnpj}</p>
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

      {/* Middle: Global Quick Search (Desktop) */}
      <div className="hidden md:flex items-center gap-2 max-w-sm lg:max-w-md w-full px-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Buscar por patrimônio, série, ativo ou colaborador..."
            className="w-full pl-8 pr-12 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-400 bg-neutral-200/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </div>
      </div>

      {/* Right: Search Toggle (Mobile), Notifications & User Session */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          title="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          className="relative p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          title="Notificações & Auditoria"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        <div className="h-4 w-[1px] bg-neutral-200 mx-0.5 sm:mx-1" />

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-0.5 sm:pl-1">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
            alt="Carlos Eduardo Silva"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-200 shrink-0"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-neutral-900 leading-none">Carlos Eduardo</p>
            <span className="text-[10px] text-emerald-700 font-medium inline-flex items-center gap-1 leading-none mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Admin T.I.
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Expandable Drawer Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute inset-x-0 top-0 h-14 bg-white border-b border-neutral-200 px-3 flex items-center gap-2 z-40 animate-in slide-in-from-top duration-150 shadow-sm">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Buscar no Inventy..."
            autoFocus
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none"
          />
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-lg shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
