import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { MovementTypeBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MovementType } from '../../types';
import { ArrowLeftRight, Search, Plus, User, Calendar, CheckCircle2, Laptop, Eye, FileCheck2 } from 'lucide-react';
import { ResponsibilityTermViewerModal } from '../responsibility-terms/ResponsibilityTermViewerModal';

export const MovementListView: React.FC = () => {
  const { movements, assets, collaborators, registerMovement, currentOrg, addToast } = useInventy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [isNewMovementModalOpen, setIsNewMovementModalOpen] = useState(false);
  const [viewerTermId, setViewerTermId] = useState<string | null>(null);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [tipo, setTipo] = useState<MovementType>('Atribuição');
  const [novoResponsavelId, setNovoResponsavelId] = useState(collaborators[0]?.id || '');
  const [motivo, setMotivo] = useState('');

  const filteredMovements = movements.filter((m) => {
    const matchSearch =
      m.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assetPatrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.novoResponsavel && m.novoResponsavel.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.motivo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchType = selectedType === 'todos' || m.tipo === selectedType;

    return matchSearch && matchType;
  });

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) {
      addToast('error', 'Selecione um Ativo', 'Escolha o ativo a ser movimentado.');
      return;
    }

    registerMovement({
      assetId: selectedAssetId,
      tipo,
      novoResponsavelId: tipo === 'Devolução' ? undefined : novoResponsavelId,
      motivo,
    });

    setIsNewMovementModalOpen(false);
    setMotivo('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Histórico Geral de Movimentações</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro imutável de custódia e transferências de ativos em <strong className="text-slate-700">{currentOrg.name}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsNewMovementModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-emerald-400" /> Registrar Movimentação
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por patrimônio, ativo, responsável, motivo..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="todos">Todos os Tipos</option>
          <option value="Atribuição">Atribuição</option>
          <option value="Devolução">Devolução</option>
          <option value="Transferência">Transferência</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Data & Hora</th>
                <th className="py-3 px-4">Ativo</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Custódia / Responsável</th>
                <th className="py-3 px-4">Motivo / Observação</th>
                <th className="py-3 px-4">Termo A4</th>
                <th className="py-3 px-4 text-right">Registrado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">{mov.data}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                        {mov.assetPatrimonio}
                      </span>
                      <span className="font-semibold text-slate-900 truncate max-w-xs">{mov.assetName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <MovementTypeBadge tipo={mov.tipo} />
                  </td>
                  <td className="py-3 px-4">
                    {mov.novoResponsavel ? (
                      <span className="font-semibold text-slate-900">{mov.novoResponsavel}</span>
                    ) : (
                      <span className="text-slate-400">Devolvido ao Estoque</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{mov.motivo}</td>
                  <td className="py-3 px-4">
                    {mov.responsibilityTermId ? (
                      <button
                        type="button"
                        onClick={() => setViewerTermId(mov.responsibilityTermId || null)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] rounded transition shadow-2xs"
                      >
                        <FileCheck2 className="w-3 h-3 text-emerald-600" />
                        <span>Ver Termo</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[10px] italic">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-medium">{mov.usuarioRegistro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nova Movimentação */}
      <Modal
        isOpen={isNewMovementModalOpen}
        onClose={() => setIsNewMovementModalOpen(false)}
        title="Registrar Nova Movimentação"
        subtitle="Efetuar transferência, atribuição ou devolução de ativo"
        maxWidth="md"
      >
        <form onSubmit={handleCreateMovement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Selecione o Ativo *</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.patrimonio} — {a.nome} ({a.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Tipo de Operação *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Atribuição', 'Devolução', 'Transferência'] as MovementType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    tipo === t
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {tipo !== 'Devolução' && (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Novo Responsável *</label>
              <select
                value={novoResponsavelId}
                onChange={(e) => setNovoResponsavelId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                {collaborators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} — {c.cargo}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Motivo / Justificativa *</label>
            <textarea
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva a razão da movimentação..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewMovementModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Efetivar Operação
            </button>
          </div>
        </form>
      </Modal>

      <ResponsibilityTermViewerModal
        termId={viewerTermId}
        onClose={() => setViewerTermId(null)}
      />
    </div>
  );
};
