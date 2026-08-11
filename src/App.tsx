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
import { ResponsibilityTermList } from './components/responsibility-terms/ResponsibilityTermList';

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
      case 'termos':
        return <ResponsibilityTermList />;
      case 'localizacoes':
        return <LocationView />;
      case 'configuracoes':
        return <SettingsLayout />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto bg-neutral-50/70 h-[calc(100vh-3.5rem)] w-full min-w-0">
      <div className="max-w-7xl mx-auto w-full">{renderCurrentView()}</div>
    </main>
  );
};

export default function App() {
  return (
    <InventyProvider>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
        {/* App Shell Header */}
        <Header />

        {/* Body Layout: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <MainContent />
        </div>

        {/* Toasts Feedback */}
        <ToastContainer />
      </div>
    </InventyProvider>
  );
}
