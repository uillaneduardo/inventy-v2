import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Organization,
  User,
  Inventory,
  Asset,
  Collaborator,
  LocationItem,
  ApplicationPackage,
  PackageApplication,
  Movement,
  AssetCategory,
  Tag,
  Credential,
  AssetStatus,
  MovementType,
} from '../types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_TAGS,
  INITIAL_PACKAGES,
  INITIAL_COLLABORATORS,
  INITIAL_LOCATIONS,
  INITIAL_INVENTORIES,
  INITIAL_PACKAGE_APPLICATIONS,
  INITIAL_ASSETS,
  INITIAL_MOVEMENTS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface InventyContextType {
  // Active Org
  currentOrg: Organization;
  setCurrentOrgId: (id: string) => void;
  organizations: Organization[];

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  selectedCollaboratorId: string | null;
  setSelectedCollaboratorId: (id: string | null) => void;
  settingsSubTab: string;
  setSettingsSubTab: (subTab: string) => void;

  // Data collections filtered by current org
  assets: Asset[];
  packages: ApplicationPackage[];
  packageApplications: PackageApplication[];
  collaborators: Collaborator[];
  locations: LocationItem[];
  movements: Movement[];
  inventories: Inventory[];
  categories: AssetCategory[];
  tags: Tag[];
  users: User[];

  // Actions - Assets
  addAsset: (asset: Omit<Asset, 'id' | 'orgId'>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // Actions - Packages & Package Applications
  addPackage: (pkg: Omit<ApplicationPackage, 'id' | 'orgId' | 'updatedAt' | 'appliedCount'>) => void;
  updatePackage: (id: string, pkg: Partial<ApplicationPackage>) => void;
  deletePackage: (id: string) => void;
  applyPackageToAsset: (
    assetId: string,
    packageId: string,
    observacaoGeral: string,
    credentials: Array<Omit<Credential, 'id' | 'packageApplicationId'>>
  ) => void;

  // Actions - Collaborators
  addCollaborator: (collab: Omit<Collaborator, 'id' | 'orgId' | 'assignedAssetsCount'>) => void;
  updateCollaborator: (id: string, collab: Partial<Collaborator>) => void;
  deleteCollaborator: (id: string) => void;

  // Actions - Movements
  registerMovement: (data: {
    assetId: string;
    tipo: MovementType;
    novoResponsavelId?: string;
    novaLocalizacaoId?: string;
    motivo: string;
  }) => void;

  // Actions - Locations
  addLocation: (loc: Omit<LocationItem, 'id' | 'orgId'>) => void;

  // Actions - Categories & Tags
  addCategory: (cat: Omit<AssetCategory, 'id' | 'orgId' | 'totalAssets'>) => void;
  addTag: (tag: Omit<Tag, 'id' | 'orgId'>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Audit Logs (simulated)
  auditLogs: Array<{ id: string; user: string; action: string; timestamp: string }>;
}

const InventyContext = createContext<InventyContextType | undefined>(undefined);

export const InventyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [currentOrgId, setCurrentOrgIdState] = useState<string>('org-1');

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
  const [settingsSubTab, setSettingsSubTab] = useState<string>('pacotes');

  // Data states
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [packages, setPackages] = useState<ApplicationPackage[]>(INITIAL_PACKAGES);
  const [packageApplications, setPackageApplications] = useState<PackageApplication[]>(INITIAL_PACKAGE_APPLICATIONS);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [movements, setMovements] = useState<Movement[]>(INITIAL_MOVEMENTS);
  const [inventories, setInventories] = useState<Inventory[]>(INITIAL_INVENTORIES);
  const [categories, setCategories] = useState<AssetCategory[]>(INITIAL_CATEGORIES);
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // Toasts & Audit Logs
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; user: string; action: string; timestamp: string }>>([
    { id: 'log-1', user: 'Carlos Eduardo Silva', action: 'Visualizou credencial AnyDesk do ativo PAT-2026-0042', timestamp: 'Hoje às 14:02' },
    { id: 'log-2', user: 'Mariana Santos Costa', action: 'Aplicou Pacote "Padrão Design" no ativo PAT-2026-0089', timestamp: '18/06/2026 às 10:15' },
  ]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentOrg = useMemo(() => {
    return organizations.find((o) => o.id === currentOrgId) || organizations[0];
  }, [organizations, currentOrgId]);

  const setCurrentOrgId = (id: string) => {
    setCurrentOrgIdState(id);
    setSelectedAssetId(null);
    setSelectedCollaboratorId(null);
    const targetOrg = organizations.find((o) => o.id === id);
    if (targetOrg) {
      addToast('info', 'Organização Alterada', `Alternado para ${targetOrg.name}`);
    }
  };

  // Filtered views by org
  const orgAssets = useMemo(() => assets.filter((a) => a.orgId === currentOrgId), [assets, currentOrgId]);
  const orgPackages = useMemo(() => packages.filter((p) => p.orgId === currentOrgId), [packages, currentOrgId]);
  const orgPackageApps = useMemo(() => {
    const orgAssetIds = new Set(orgAssets.map((a) => a.id));
    return packageApplications.filter((pa) => orgAssetIds.has(pa.assetId));
  }, [packageApplications, orgAssets]);
  const orgCollaborators = useMemo(() => collaborators.filter((c) => c.orgId === currentOrgId), [collaborators, currentOrgId]);
  const orgLocations = useMemo(() => locations.filter((l) => l.orgId === currentOrgId), [locations, currentOrgId]);
  const orgMovements = useMemo(() => movements.filter((m) => m.orgId === currentOrgId), [movements, currentOrgId]);
  const orgInventories = useMemo(() => inventories.filter((i) => i.orgId === currentOrgId), [inventories, currentOrgId]);
  const orgCategories = useMemo(() => categories.filter((c) => c.orgId === currentOrgId), [categories, currentOrgId]);
  const orgTags = useMemo(() => tags.filter((t) => t.orgId === currentOrgId), [tags, currentOrgId]);
  const orgUsers = useMemo(() => users.filter((u) => u.orgId === currentOrgId), [users, currentOrgId]);

  // Handlers
  const addAsset = (data: Omit<Asset, 'id' | 'orgId'>) => {
    const newAsset: Asset = {
      ...data,
      id: `ast-${Date.now()}`,
      orgId: currentOrgId,
      appliedPackagesCount: 0,
    };
    setAssets((prev) => [newAsset, ...prev]);
    addToast('success', 'Ativo Cadastrado', `Ativo ${newAsset.patrimonio} (${newAsset.nome}) criado com sucesso.`);
  };

  const updateAsset = (id: string, partial: Partial<Asset>) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...partial } : a)));
    addToast('success', 'Ativo Atualizado', 'As informações do ativo foram salvas.');
  };

  const deleteAsset = (id: string) => {
    const target = assets.find((a) => a.id === id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Ativo Removido', `O ativo ${target?.patrimonio || ''} foi desativado.`);
  };

  const addPackage = (data: Omit<ApplicationPackage, 'id' | 'orgId' | 'updatedAt' | 'appliedCount'>) => {
    const newPkg: ApplicationPackage = {
      ...data,
      id: `pkg-${Date.now()}`,
      orgId: currentOrgId,
      updatedAt: new Date().toISOString().split('T')[0],
      appliedCount: 0,
    };
    setPackages((prev) => [newPkg, ...prev]);
    addToast('success', 'Pacote Criado', `O pacote "${newPkg.nome}" foi salvo com ${newPkg.itens.length} itens.`);
  };

  const updatePackage = (id: string, partial: Partial<ApplicationPackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
    addToast('success', 'Pacote Editado', 'As alterações do modelo de pacote foram salvas.');
  };

  const deletePackage = (id: string) => {
    const target = packages.find((p) => p.id === id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addToast('warning', 'Pacote Excluído', `O modelo de pacote "${target?.nome || ''}" foi removido.`);
  };

  // CRITICAL REQUIREMENT:
  // "Ao aplicar, o sistema deve criar um registro independente contendo uma fotografia dos itens existentes naquele pacote naquele momento.
  // Alterações futuras no pacote original não podem modificar aplicações históricas já registradas nos ativos."
  const applyPackageToAsset = (
    assetId: string,
    packageId: string,
    observacaoGeral: string,
    credentialsInput: Array<Omit<Credential, 'id' | 'packageApplicationId'>>
  ) => {
    const targetAsset = assets.find((a) => a.id === assetId);
    const targetPkg = packages.find((p) => p.id === packageId);

    if (!targetAsset || !targetPkg) return;

    const appId = `app-pkg-${Date.now()}`;
    const itemsSnapshot = JSON.parse(JSON.stringify(targetPkg.itens)); // Deep copy frozen snapshot

    const formattedCredentials: Credential[] = credentialsInput.map((c, index) => ({
      ...c,
      id: `cred-${appId}-${index + 1}`,
      packageApplicationId: appId,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }));

    const newAppRecord: PackageApplication = {
      id: appId,
      assetId: targetAsset.id,
      assetName: targetAsset.nome,
      assetPatrimonio: targetAsset.patrimonio,
      packageId: targetPkg.id,
      packageName: targetPkg.nome,
      packageVersao: targetPkg.versao,
      dataAplicacao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuarioResponsavel: 'Carlos Eduardo Silva (Sua Sessão)',
      observacaoGeral: observacaoGeral || `Aplicação do pacote ${targetPkg.nome} v${targetPkg.versao}`,
      itensAplicados: itemsSnapshot, // Frozen snapshot!
      credenciais: formattedCredentials,
    };

    setPackageApplications((prev) => [newAppRecord, ...prev]);

    // Update asset package count
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, appliedPackagesCount: (a.appliedPackagesCount || 0) + 1 } : a))
    );

    // Increment package application count
    setPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, appliedCount: (p.appliedCount || 0) + 1 } : p))
    );

    // Audit log entry
    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        user: 'Carlos Eduardo Silva',
        action: `Aplicou Pacote "${targetPkg.nome}" com ${formattedCredentials.length} credenciais no ativo ${targetAsset.patrimonio}`,
        timestamp: 'Agora mesmo',
      },
      ...prev,
    ]);

    addToast(
      'success',
      'Pacote Aplicado',
      `O pacote "${targetPkg.nome}" foi aplicado ao ativo ${targetAsset.patrimonio}. Fotografia registrada com sucesso!`
    );
  };

  const addCollaborator = (data: Omit<Collaborator, 'id' | 'orgId' | 'assignedAssetsCount'>) => {
    const newCol: Collaborator = {
      ...data,
      id: `col-${Date.now()}`,
      orgId: currentOrgId,
      assignedAssetsCount: 0,
    };
    setCollaborators((prev) => [newCol, ...prev]);
    addToast('success', 'Colaborador Cadastrado', `${newCol.nome} foi adicionado à base da organização.`);
  };

  const updateCollaborator = (id: string, partial: Partial<Collaborator>) => {
    setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)));
    addToast('success', 'Cadastro Atualizado', 'Os dados do colaborador foram atualizados.');
  };

  const deleteCollaborator = (id: string) => {
    const target = collaborators.find((c) => c.id === id);
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Colaborador Removido', `${target?.nome || ''} foi desativado.`);
  };

  const registerMovement = (data: {
    assetId: string;
    tipo: MovementType;
    novoResponsavelId?: string;
    novaLocalizacaoId?: string;
    motivo: string;
  }) => {
    const targetAsset = assets.find((a) => a.id === data.assetId);
    if (!targetAsset) return;

    let targetCollab = data.novoResponsavelId ? collaborators.find((c) => c.id === data.novoResponsavelId) : undefined;
    
    // Find location path if specified
    let newLocationPath = targetAsset.locationPath;
    if (data.novaLocalizacaoId) {
      newLocationPath = `Unidade São Paulo (Sede) > Nova Localização (${data.novaLocalizacaoId})`;
    }

    const previousResp = targetAsset.responsavelNome || 'Nenhum (Disponível)';
    const previousLoc = targetAsset.locationPath;

    let updatedStatus: AssetStatus = targetAsset.status;
    if (data.tipo === 'Atribuição') updatedStatus = 'Em uso';
    else if (data.tipo === 'Devolução') updatedStatus = 'Disponível';

    // Update Asset
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === data.assetId) {
          return {
            ...a,
            status: updatedStatus,
            responsavelId: data.tipo === 'Devolução' ? undefined : (targetCollab?.id || a.responsavelId),
            responsavelNome: data.tipo === 'Devolução' ? undefined : (targetCollab?.nome || a.responsavelNome),
            locationPath: newLocationPath,
          };
        }
        return a;
      })
    );

    // Create Movement history record
    const newMovement: Movement = {
      id: `mov-${Date.now()}`,
      assetId: targetAsset.id,
      assetName: targetAsset.nome,
      assetPatrimonio: targetAsset.patrimonio,
      tipo: data.tipo,
      data: new Date().toISOString().replace('T', ' ').substring(0, 19),
      responsavelAnterior: previousResp,
      novoResponsavel: data.tipo === 'Devolução' ? undefined : targetCollab?.nome,
      localizacaoAnterior: previousLoc,
      novaLocalizacao: newLocationPath,
      usuarioRegistro: 'Carlos Eduardo Silva',
      motivo: data.motivo,
      orgId: currentOrgId,
    };

    setMovements((prev) => [newMovement, ...prev]);

    addToast(
      'success',
      `Movimentação: ${data.tipo}`,
      `O ativo ${targetAsset.patrimonio} foi movimentado com sucesso.`
    );
  };

  const addLocation = (data: Omit<LocationItem, 'id' | 'orgId'>) => {
    const newLoc: LocationItem = {
      ...data,
      id: `loc-${Date.now()}`,
      orgId: currentOrgId,
    };
    setLocations((prev) => [...prev, newLoc]);
    addToast('success', 'Localização Adicionada', `A localização ${newLoc.nome} foi registrada.`);
  };

  const addCategory = (data: Omit<AssetCategory, 'id' | 'orgId' | 'totalAssets'>) => {
    const newCat: AssetCategory = {
      ...data,
      id: `cat-${Date.now()}`,
      orgId: currentOrgId,
      totalAssets: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'Categoria Criada', `A categoria "${newCat.nome}" foi cadastrada.`);
  };

  const addTag = (data: Omit<Tag, 'id' | 'orgId'>) => {
    const newTag: Tag = {
      ...data,
      id: `tag-${Date.now()}`,
      orgId: currentOrgId,
    };
    setTags((prev) => [...prev, newTag]);
    addToast('success', 'Tag Criada', `Tag "${newTag.nome}" disponível para vinculação.`);
  };

  return (
    <InventyContext.Provider
      value={{
        currentOrg,
        setCurrentOrgId,
        organizations,
        activeTab,
        setActiveTab,
        selectedAssetId,
        setSelectedAssetId,
        selectedCollaboratorId,
        setSelectedCollaboratorId,
        settingsSubTab,
        setSettingsSubTab,
        assets: orgAssets,
        packages: orgPackages,
        packageApplications: orgPackageApps,
        collaborators: orgCollaborators,
        locations: orgLocations,
        movements: orgMovements,
        inventories: orgInventories,
        categories: orgCategories,
        tags: orgTags,
        users: orgUsers,
        addAsset,
        updateAsset,
        deleteAsset,
        addPackage,
        updatePackage,
        deletePackage,
        applyPackageToAsset,
        addCollaborator,
        updateCollaborator,
        deleteCollaborator,
        registerMovement,
        addLocation,
        addCategory,
        addTag,
        toasts,
        addToast,
        removeToast,
        auditLogs,
      }}
    >
      {children}
    </InventyContext.Provider>
  );
};

export const useInventy = () => {
  const context = useContext(InventyContext);
  if (!context) {
    throw new Error('useInventy must be used within an InventyProvider');
  }
  return context;
};
