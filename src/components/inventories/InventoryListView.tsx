import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { Modal } from '../common/Modal';
import { Boxes, Plus, CheckCircle2, Clock, Calendar, Building2, User, Play, ChevronRight } from 'lucide-react';

export const InventoryListView: React.FC = () => {
  const { inventories, currentOrg, addToast } = useInventy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('Unidade São Paulo (Sede)');
  const [responsavel, setResponsavel] = useState('Mariana Santos Costa');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inventários & Contagens Físicas</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auditorias patrimoniais de hardware em <strong className="text-slate-700">{currentOrg.name}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-emerald-400" /> Iniciar Novo Inventário
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventories.map((inv) => {
          const progress = inv.totalItens > 0 ? Math.round((inv.itensVerificados / inv.totalItens) * 100) : 0;
          const isDone = inv.status === 'Concluído';
          const isInProgress = inv.status === 'Em andamento';

          return (
            <div key={inv.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    {inv.codigo}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isInProgress
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{inv.nome}</h3>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{inv.unidade}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{inv.responsavel}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Progresso da Contagem</span>
                  <span className="font-bold text-slate-900">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isDone ? 'bg-emerald-500' : isInProgress ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-right">
                  {inv.itensVerificados} de {inv.totalItens} itens conferidos
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Inventory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Abrir Nova Auditoria de Inventário"
        subtitle="Agendar ou iniciar conferência física de ativos"
        maxWidth="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addToast('success', 'Inventário Agendado', `Auditoria "${nome}" foi criada com sucesso.`);
            setIsModalOpen(false);
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Título do Inventário *</label>
            <input
              type="text"
              placeholder="Ex: Auditoria Semestral T.I. Q4/2026"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Unidade Responsável *</label>
            <select
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
            >
              <option value="Unidade São Paulo (Sede)">Unidade São Paulo (Sede)</option>
              <option value="Unidade Rio de Janeiro">Unidade Rio de Janeiro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Auditor Responsável *</label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Criar Inventário
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
