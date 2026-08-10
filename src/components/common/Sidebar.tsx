import React from 'react';
import { useInventy } from '../../context/InventyContext';
import {
  LayoutDashboard,
  Boxes,
  Laptop,
  Users,
  ArrowLeftRight,
  MapPin,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedAssetId, setSelectedCollaboratorId, currentOrg } = useInventy();

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedAssetId(null);
    setSelectedCollaboratorId(null);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventarios', label: 'Inventários', icon: Boxes },
    { id: 'ativos', label: 'Ativos', icon: Laptop },
    { id: 'colaboradores', label: 'Colaboradores', icon: Users },
    { id: 'movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
    { id: 'localizacoes', label: 'Localizações', icon: MapPin },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
      {/* Main Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Módulos Principais
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          );
        })}

        {/* Separator */}
        <div className="pt-4 pb-2">
          <div className="h-[1px] bg-slate-200/80" />
        </div>

        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Administração
        </div>

        {/* Settings Tab */}
        <button
          onClick={() => handleNav('configuracoes')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'configuracoes'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings
              className={`w-4 h-4 ${activeTab === 'configuracoes' ? 'text-emerald-400' : 'text-slate-500'}`}
            />
            <span>Configurações</span>
          </div>
          {activeTab === 'configuracoes' && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>

      {/* Footer Org Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Plano Ativo</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
              {currentOrg.plan}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-1 truncate">{currentOrg.name}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {currentOrg.totalAssets} Ativos • {currentOrg.totalCollaborators} Pessoas
          </p>
        </div>
      </div>
    </aside>
  );
};
