import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { Modal } from '../common/Modal';
import { ApplicationPackage, PackageItem, PackageCategory } from '../../types';
import {
  Building2,
  Users,
  Shield,
  FolderTree,
  Tag as TagIcon,
  Package,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Check,
  AlertCircle,
  Layers,
} from 'lucide-react';

export const SettingsLayout: React.FC = () => {
  const {
    currentOrg,
    users,
    categories,
    tags,
    packages,
    settingsSubTab,
    setSettingsSubTab,
    addPackage,
    updatePackage,
    deletePackage,
    addCategory,
    addTag,
    addToast,
  } = useInventy();

  // Package Editor Modal state
  const [editingPackage, setEditingPackage] = useState<ApplicationPackage | null>(null);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  // Package Form state
  const [pkgNome, setPkgNome] = useState('');
  const [pkgDescricao, setPkgDescricao] = useState('');
  const [pkgVersao, setPkgVersao] = useState('1.0.0');
  const [pkgItens, setPkgItens] = useState<PackageItem[]>([
    { id: 'i-1', nome: 'Ubuntu 24.04 LTS', categoria: 'SO', versao: '24.04', obrigatorio: true },
    { id: 'i-2', nome: 'LibreOffice Suite', categoria: 'Produtividade', versao: '7.6', obrigatorio: true },
    { id: 'i-3', nome: 'Google Chrome Enterprise', categoria: 'Navegador', versao: '125.0', obrigatorio: true },
    { id: 'i-4', nome: 'AnyDesk Corporate', categoria: 'Acesso Remoto', versao: '7.1.13', obrigatorio: true },
    { id: 'i-5', nome: 'Acronis Cyber Protect', categoria: 'Segurança / Backup', versao: '15.0', obrigatorio: true },
  ]);

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNome, setCatNome] = useState('');
  const [catCor, setCatCor] = useState('#2563eb');
  const [catDesc, setCatDesc] = useState('');

  // Tag Modal
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagNome, setTagNome] = useState('');
  const [tagCor, setTagCor] = useState('#16a34a');

  const openNewPackageModal = () => {
    setEditingPackage(null);
    setPkgNome('');
    setPkgDescricao('');
    setPkgVersao('1.0.0');
    setPkgItens([
      { id: `i-${Date.now()}-1`, nome: 'Ubuntu 24.04 LTS', categoria: 'SO', versao: '24.04', obrigatorio: true },
      { id: `i-${Date.now()}-2`, nome: 'LibreOffice Suite', categoria: 'Produtividade', versao: '7.6', obrigatorio: true },
      { id: `i-${Date.now()}-3`, nome: 'Google Chrome Enterprise', categoria: 'Navegador', versao: '125.0', obrigatorio: true },
      { id: `i-${Date.now()}-4`, nome: 'AnyDesk Corporate', categoria: 'Acesso Remoto', versao: '7.1.13', obrigatorio: true },
    ]);
    setIsPackageModalOpen(true);
  };

  const openEditPackageModal = (pkg: ApplicationPackage) => {
    setEditingPackage(pkg);
    setPkgNome(pkg.nome);
    setPkgDescricao(pkg.descricao);
    setPkgVersao(pkg.versao);
    setPkgItens(JSON.parse(JSON.stringify(pkg.itens)));
    setIsPackageModalOpen(true);
  };

  const handleAddItemToPackage = () => {
    setPkgItens((prev) => [
      ...prev,
      {
        id: `i-${Date.now()}`,
        nome: '',
        categoria: 'Produtividade',
        versao: '1.0',
        obrigatorio: true,
      },
    ]);
  };

  const handleRemoveItemFromPackage = (id: string) => {
    setPkgItens((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePackageItemChange = (id: string, field: string, value: any) => {
    setPkgItens((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgNome.trim()) {
      addToast('error', 'Nome Obrigatório', 'Informe o nome do pacote.');
      return;
    }

    if (editingPackage) {
      updatePackage(editingPackage.id, {
        nome: pkgNome,
        descricao: pkgDescricao,
        versao: pkgVersao,
        itens: pkgItens,
      });
    } else {
      addPackage({
        nome: pkgNome,
        descricao: pkgDescricao,
        versao: pkgVersao,
        itens: pkgItens,
      });
    }

    setIsPackageModalOpen(false);
  };

  const subTabs = [
    { id: 'organizacao', label: 'Organização', icon: Building2 },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'permissoes', label: 'Permissões', icon: Shield },
    { id: 'categorias', label: 'Categorias', icon: FolderTree },
    { id: 'tags', label: 'Tags', icon: TagIcon },
    { id: 'pacotes', label: 'Pacotes de Aplicação', icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Configurações da Plataforma</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Parâmetros globais, perfis de acesso e modelos reutilizáveis para <strong className="text-slate-700">{currentOrg.name}</strong>
        </p>
      </div>

      {/* Subtabs Bar */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-4 min-w-max">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = settingsSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSettingsSubTab(tab.id)}
                className={`py-2.5 px-1 border-b-2 font-semibold text-xs flex items-center gap-2 transition-all ${
                  isActive
                    ? 'border-slate-900 text-slate-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* SUBTAB 1: Organização */}
      {settingsSubTab === 'organizacao' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Dados da Organização
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Razão Social / Nome Fantasia</label>
              <input
                type="text"
                readOnly
                value={currentOrg.name}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg.cnpj}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Código de Identificação</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg.code}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Usuários */}
      {settingsSubTab === 'usuarios' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4">Usuário</th>
                <th className="py-3 px-4">Departamento</th>
                <th className="py-3 px-4">Função / Perfil</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{u.department}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 3: Permissões */}
      {settingsSubTab === 'permissoes' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Perfis de Acesso & Permissões Granulares
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-900 block">Administrador</span>
              <p className="text-slate-500 text-[11px]">Acesso irrestrito a todos os módulos, credenciais e configurações.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-900 block">Operador de Inventário</span>
              <p className="text-slate-500 text-[11px]">Pode cadastrar ativos, movimentar equipamentos e aplicar pacotes.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-900 block">Auditor / Leitor</span>
              <p className="text-slate-500 text-[11px]">Somente leitura de dados e relatórios da plataforma.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Categorias */}
      {settingsSubTab === 'categorias' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Categorias de Ativos</h3>
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> Nova Categoria
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }} />
                  <h4 className="text-xs font-bold text-slate-900">{cat.nome}</h4>
                </div>
                <p className="text-[11px] text-slate-500">{cat.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: Tags */}
      {settingsSubTab === 'tags' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tags da Organização</h3>
            <button
              onClick={() => setIsTagModalOpen(true)}
              className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> Nova Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t.id}
                className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: t.cor }}
              >
                {t.nome}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: Pacotes de Aplicação (REUSABLE PACKAGES TEMPLATES) */}
      {settingsSubTab === 'pacotes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Modelos Reutilizáveis de Pacotes de Aplicação
              </h3>
              <p className="text-xs text-slate-500">
                Crie padrões de instalação (ex: Padrão Engenharia, Padrão Administrativo) para aplicação padronizada em ativos.
              </p>
            </div>

            <button
              onClick={openNewPackageModal}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 text-emerald-400" /> Criar Pacote de Aplicação
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-900">{pkg.nome}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      v{pkg.versao}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{pkg.descricao}</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Itens do Modelo ({pkg.itens.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pkg.itens.slice(0, 4).map((item) => (
                        <span key={item.id} className="text-[10px] font-medium bg-slate-50 border border-slate-200/80 px-1.5 py-0.2 rounded text-slate-700">
                          {item.nome}
                        </span>
                      ))}
                      {pkg.itens.length > 4 && (
                        <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.2">
                          +{pkg.itens.length - 4} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">Aplicado em {pkg.appliedCount || 0} ativo(s)</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditPackageModal(pkg)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Editar Modelo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePackage(pkg.id)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="Excluir Modelo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CRIAR OU EDITAR PACOTE DE APLICAÇÃO */}
      <Modal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>{editingPackage ? 'Editar Pacote de Aplicação' : 'Criar Novo Pacote de Aplicação'}</span>
          </div>
        }
        subtitle="Definir modelo de softwares e utilitários para padronização de estações"
        maxWidth="2xl"
      >
        <form onSubmit={handleSavePackage} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-800 mb-1">Nome do Pacote *</label>
              <input
                type="text"
                placeholder="Ex: Padrão Engenharia & CAD"
                value={pkgNome}
                onChange={(e) => setPkgNome(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Versão *</label>
              <input
                type="text"
                value={pkgVersao}
                onChange={(e) => setPkgVersao(e.target.value)}
                required
                className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Descrição Breve</label>
            <input
              type="text"
              placeholder="Ex: Pacote essencial para workstations da equipe de projetos..."
              value={pkgDescricao}
              onChange={(e) => setPkgDescricao(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Items Editor */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Itens / Softwares Integrantes do Pacote</span>
              <button
                type="button"
                onClick={handleAddItemToPackage}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Software
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {pkgItens.map((item) => (
                <div key={item.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Nome do software..."
                    value={item.nome}
                    onChange={(e) => handlePackageItemChange(item.id, 'nome', e.target.value)}
                    required
                    className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-slate-900"
                  />

                  <select
                    value={item.categoria}
                    onChange={(e) => handlePackageItemChange(item.id, 'categoria', e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-900"
                  >
                    <option value="SO">S.O.</option>
                    <option value="Produtividade">Produtividade</option>
                    <option value="Navegador">Navegador</option>
                    <option value="Acesso Remoto">Acesso Remoto</option>
                    <option value="Segurança / Backup">Segurança / Backup</option>
                    <option value="CAD / Engenharia">CAD / Engenharia</option>
                    <option value="Desenvolvimento">Dev</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Versão..."
                    value={item.versao || ''}
                    onChange={(e) => handlePackageItemChange(item.id, 'versao', e.target.value)}
                    className="w-20 font-mono bg-white border border-slate-200 rounded px-2 py-1 text-slate-900"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItemFromPackage(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsPackageModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Salvar Modelo de Pacote
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Nova Categoria de Ativo"
        subtitle="Cadastrar nova categoria no inventário"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCategory({
              nome: catNome,
              icone: 'Laptop',
              cor: catCor,
              descricao: catDesc || 'Categoria de ativos.',
            });
            setIsCatModalOpen(false);
            setCatNome('');
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Nome da Categoria *</label>
            <input
              type="text"
              value={catNome}
              onChange={(e) => setCatNome(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Cor do Badge</label>
            <input
              type="color"
              value={catCor}
              onChange={(e) => setCatCor(e.target.value)}
              className="w-12 h-8 p-0 rounded border border-slate-200 cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              Salvar Categoria
            </button>
          </div>
        </form>
      </Modal>

      {/* Tag Modal */}
      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title="Nova Tag de Identificação"
        subtitle="Cadastrar tag colorida para ativos"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTag({ nome: tagNome, cor: tagCor });
            setIsTagModalOpen(false);
            setTagNome('');
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Nome da Tag *</label>
            <input
              type="text"
              value={tagNome}
              onChange={(e) => setTagNome(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Cor</label>
            <input
              type="color"
              value={tagCor}
              onChange={(e) => setTagCor(e.target.value)}
              className="w-12 h-8 p-0 rounded border border-slate-200 cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              Salvar Tag
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
