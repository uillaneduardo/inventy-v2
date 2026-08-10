import React from 'react';
import { InventyProvider, useInventy } from './context/InventyContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';

import { DashboardView } from './components/dashboard/DashboardView';
import { InventoryListView } from './components/inventories/InventoryListView';
import { AssetListView } from './components/assets/AssetListView';
import { CollaboratorListView } from './components/collaborators/CollaboratorListView';
import { MovementListView } from './components/movements/MovementListView';
import { LocationView } from './components/locations/LocationView';
import { SettingsLayout } from './components/settings/SettingsLayout';

const MainContent: React.FC = () => {
  const { activeTab } = useInventy();

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventarios':
        return <InventoryListView />;
      case 'ativos':
        return <AssetListView />;
      case 'colaboradores':
        return <CollaboratorListView />;
      case 'movimentacoes':
        return <MovementListView />;
      case 'localizacoes':
        return <LocationView />;
      case 'configuracoes':
        return <SettingsLayout />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-slate-50/70 h-[calc(100vh-3.5rem)]">
      <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
    </main>
  );
};

export default function App() {
  return (
    <InventyProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-slate-900 selection:text-white">
        {/* App Shell Header */}
        <Header />

        {/* Body Layout: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>

        {/* Toasts Feedback */}
        <ToastContainer />
      </div>
    </InventyProvider>
  );
}
