import React, { useState, useMemo } from 'react';
import { useInventy } from '../../context/InventyContext';
import { AssetStatusBadge } from '../common/Badge';
import { AssetDetailView } from './AssetDetailView';
import { Modal } from '../common/Modal';
import { AssetStatus } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Laptop,
  ChevronRight,
  Download,
  Building,
  User,
  MapPin,
  Tag as TagIcon,
  CheckCircle2,
} from 'lucide-react';

export const AssetListView: React.FC = () => {
  const { assets, categories, collaborators, selectedAssetId, setSelectedAssetId, addAsset, currentOrg } =
    useInventy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);

  // New Asset Form State
  const [novoNome, setNovoNome] = useState('');
  const [novoPatrimonio, setNovoPatrimonio] = useState(`PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [novaCategoriaId, setNovaCategoriaId] = useState(categories[0]?.id || '');
  const [novaMarca, setNovaMarca] = useState('');
  const [novoModelo, setNovoModelo] = useState('');
  const [novoNumeroSerie, setNovoNumeroSerie] = useState('');
  const [novoStatus, setNovoStatus] = useState<AssetStatus>('Disponível');
  const [novoValor, setNovoValor] = useState<number>(3500);
  const [novaDescricao, setNovaDescricao] = useState('');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchSearch =
        asset.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.responsavelNome && asset.responsavelNome.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'todos' || asset.categoriaId === selectedCategory;
      const matchStatus = selectedStatus === 'todos' || asset.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [assets, searchTerm, selectedCategory, selectedStatus]);

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find((c) => c.id === novaCategoriaId);

    addAsset({
      patrimonio: novoPatrimonio,
      nome: novoNome,
      descricao: novaDescricao || 'Equipamento corporativo cadastrado na plataforma.',
      categoriaId: novaCategoriaId,
      categoriaNome: catObj?.nome || 'Notebooks & MacBooks',
      marca: novaMarca || 'Dell',
      modelo: novoModelo || 'Latitude 5430',
      numeroSerie: novoNumeroSerie || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      tags: ['Garantia Ativa'],
      status: novoStatus,
      inventoryId: 'inv-2026-q3',
      inventoryName: 'Auditoria Anual Q3/2026',
      locationId: 'loc-sp-pa-a4-s401',
      locationPath: 'Unidade São Paulo (Sede) > Prédio A > 4º Andar > Sala T.I. (401)',
      valor: Number(novoValor) || 0,
      dataAquisicao: new Date().toISOString().split('T')[0],
      dataGarantia: '2028-12-31',
      observacoes: 'Cadastrado recentemente no Inventy.',
    });

    setIsNewAssetModalOpen(false);
    // Reset form
    setNovoNome('');
    setNovoPatrimonio(`PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  if (selectedAssetId) {
    return <AssetDetailView assetId={selectedAssetId} onBack={() => setSelectedAssetId(null)} />;
  }

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestão de Ativos Empresariais</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredAssets.length} de {assets.length} ativos listados para {currentOrg.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewAssetModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Cadastrar Ativo
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por patrimônio, série, marca, responsável..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="todos">Todas Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="todos">Todos Status</option>
            <option value="Disponível">Disponível</option>
            <option value="Em uso">Em uso</option>
            <option value="Em manutenção">Em manutenção</option>
            <option value="Descartado">Descartado</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Patrimônio / Ativo</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Responsável Atual</th>
                <th className="py-3 px-4">Localização</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Laptop className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Nenhum ativo encontrado com estes filtros.</p>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Patrimônio / Ativo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {asset.patrimonio}
                            </span>
                            <span className="font-semibold text-slate-900 truncate max-w-xs">{asset.nome}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {asset.marca} • S/N: {asset.numeroSerie}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-3 px-4 font-medium text-slate-800">{asset.categoriaNome}</td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <AssetStatusBadge status={asset.status} />
                    </td>

                    {/* Responsável */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{asset.responsavelNome || 'Nenhum'}</span>
                      </div>
                    </td>

                    {/* Localização */}
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">
                      {asset.locationPath.split('>').pop()?.trim()}
                    </td>

                    {/* Ação */}
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-800">
                        Detalhes <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Cadastrar Novo Ativo */}
      <Modal
        isOpen={isNewAssetModalOpen}
        onClose={() => setIsNewAssetModalOpen(false)}
        title="Cadastrar Novo Ativo"
        subtitle="Adicionar novo equipamento ao acervo patrimonial da organização"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAsset} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Código Patrimônio *</label>
              <input
                type="text"
                value={novoPatrimonio}
                onChange={(e) => setNovoPatrimonio(e.target.value)}
                required
                className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Categoria *</label>
              <select
                value={novaCategoriaId}
                onChange={(e) => setNovaCategoriaId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Nome do Ativo / Equipamento *</label>
            <input
              type="text"
              placeholder="Ex: Dell XPS 15 9530 i9 32GB"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Marca *</label>
              <input
                type="text"
                placeholder="Ex: Dell / Apple"
                value={novaMarca}
                onChange={(e) => setNovaMarca(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Modelo *</label>
              <input
                type="text"
                placeholder="Ex: XPS 15 9530"
                value={novoModelo}
                onChange={(e) => setNovoModelo(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Número de Série *</label>
              <input
                type="text"
                placeholder="Ex: 8HG39X2-BR"
                value={novoNumeroSerie}
                onChange={(e) => setNovoNumeroSerie(e.target.value)}
                required
                className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Status Inicial *</label>
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value as AssetStatus)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Disponível">Disponível</option>
                <option value="Em uso">Em uso</option>
                <option value="Em manutenção">Em manutenção</option>
                <option value="Descartado">Descartado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Valor de Aquisição (R$)</label>
              <input
                type="number"
                value={novoValor}
                onChange={(e) => setNovoValor(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewAssetModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Salvar Ativo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
