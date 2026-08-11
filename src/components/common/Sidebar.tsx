import React from 'react';
import { useInventy } from '../../context/InventyContext';
import {
  LayoutDashboard,
  Boxes,
  Laptop,
  Users,
  ArrowLeftRight,
  MapPin,
  FileCheck2,
  Settings,
  ChevronRight,
  X,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedAssetId,
    setSelectedCollaboratorId,
    currentOrg,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useInventy();

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedAssetId(null);
    setSelectedCollaboratorId(null);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventarios', label: 'Inventários', icon: Boxes },
    { id: 'ativos', label: 'Ativos', icon: Laptop },
    { id: 'colaboradores', label: 'Colaboradores', icon: Users },
    { id: 'movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
    { id: 'localizacoes', label: 'Localizações', icon: MapPin },
  ];

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full bg-white text-neutral-900">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        {isMobile && (
          <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-neutral-200/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center text-white font-bold">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-neutral-900">Inventy</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Módulos Principais
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-100 text-neutral-900 font-semibold border border-neutral-200/80 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 font-bold' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>
          );
        })}

        {/* Separator */}
        <div className="pt-3 pb-2">
          <div className="h-[1px] bg-neutral-200/80" />
        </div>

        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Administração
        </div>

        {/* Settings Tab */}
        <button
          onClick={() => handleNav('configuracoes')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'configuracoes'
              ? 'bg-neutral-100 text-neutral-900 font-semibold border border-neutral-200/80 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings
              className={`w-4 h-4 ${activeTab === 'configuracoes' ? 'text-emerald-600 font-bold' : 'text-neutral-400'}`}
            />
            <span>Configurações</span>
          </div>
          {activeTab === 'configuracoes' && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
        </button>
      </div>

      {/* Footer Org Info */}
      <div className="p-3 border-t border-neutral-200/80 bg-neutral-50/60">
        <div className="bg-white p-2.5 rounded-lg border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Plano Ativo</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {currentOrg.plan}
            </span>
          </div>
          <p className="text-xs font-semibold text-neutral-900 mt-1 truncate">{currentOrg.name}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            {currentOrg.totalAssets} Ativos • {currentOrg.totalCollaborators} Pessoas
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= md) */}
      <aside className="hidden md:flex w-56 lg:w-60 bg-white border-r border-neutral-200/80 flex-col shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Off-Canvas (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
