import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { ResponsibilityTermViewerModal } from './ResponsibilityTermViewerModal';
import { ResponsibilityTermTemplateFormModal } from './ResponsibilityTermTemplateFormModal';
import { TermTemplate, ResponsibilityTerm } from '../../types';
import {
  FileCheck2,
  Search,
  Plus,
  Eye,
  Printer,
  FileText,
  Sliders,
  CheckCircle2,
  XCircle,
  Building,
  User,
  Laptop,
  Calendar,
} from 'lucide-react';

export const ResponsibilityTermList: React.FC = () => {
  const {
    responsibilityTerms,
    termTemplates,
    addTermTemplate,
    updateTermTemplate,
    deleteTermTemplate,
    toggleTermTemplateActive,
  } = useInventy();

  const [activeSubTab, setActiveSubTab] = useState<'termos' | 'modelos'>('termos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');

  // Modals state
  const [viewerTermId, setViewerTermId] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<TermTemplate | null>(null);

  // Filtered Issued Terms
  const filteredTerms = responsibilityTerms.filter((term) => {
    const matchesSearch =
      term.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.snapshot.collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.snapshot.collaborator.cpf.includes(searchTerm) ||
      term.snapshot.asset.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.snapshot.asset.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'todos' || term.snapshot.movement.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleEditTemplate = (template: TermTemplate) => {
    setTemplateToEdit(template);
    setIsTemplateModalOpen(true);
  };

  const handleNewTemplate = () => {
    setTemplateToEdit(null);
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = (data: Omit<TermTemplate, 'id' | 'orgId' | 'updatedAt'>) => {
    if (templateToEdit) {
      updateTermTemplate(templateToEdit.id, data);
    } else {
      addTermTemplate(data);
    }
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Termos de Responsabilidade
              </h1>
              <p className="text-xs text-slate-500">
                Emissão, auditoria e gestão de modelos de documentos A4 com snapshot jurídico.
              </p>
            </div>
          </div>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSubTab('termos')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'termos'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Termos Emitidos ({responsibilityTerms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('modelos')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'modelos'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modelos e Cláusulas ({termTemplates.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'termos' ? (
        /* Subtab: Termos Emitidos */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, colaborador, CPF, patrimônio..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="Atribuição">Atribuição</option>
                <option value="Devolução">Devolução</option>
                <option value="Transferência">Transferência</option>
              </select>
            </div>
          </div>

          {/* Terms Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Código / Data</th>
                    <th className="py-3 px-4">Colaborador / CPF</th>
                    <th className="py-3 px-4">Ativo Vinculado</th>
                    <th className="py-3 px-4">Operação</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTerms.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Nenhum termo de responsabilidade localizado.
                      </td>
                    </tr>
                  ) : (
                    filteredTerms.map((term) => (
                      <tr key={term.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 block">
                            {term.codigo}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {term.createdAt.substring(0, 10)}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <div>
                              <strong className="text-slate-800 block">
                                {term.snapshot.collaborator.name}
                              </strong>
                              <span className="text-[10px] text-slate-400 font-mono">
                                CPF: {term.snapshot.collaborator.cpf}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <div>
                              <strong className="text-slate-800 font-mono block">
                                {term.snapshot.asset.patrimonio}
                              </strong>
                              <span className="text-[10px] text-slate-500 truncate max-w-[180px] block">
                                {term.snapshot.asset.name}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {term.snapshot.movement.type}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setViewerTermId(term.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ver / Imprimir A4</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Subtab: Modelos e Cláusulas */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Gerencie modelos de termos impressos, textos jurídicos e campos visíveis.
            </p>
            <button
              type="button"
              onClick={handleNewTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Modelo de Termo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {termTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{template.nome}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {template.titulo}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTermTemplateActive(template.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        template.ativo
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {template.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded border border-slate-100 font-mono text-[11px]">
                    {template.textoPadrao}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {template.tiposMovimentacao.map((tipo) => (
                      <span
                        key={tipo}
                        className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
                      >
                        Gatilho: {tipo}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Atualizado: {template.updatedAt.substring(0, 10)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditTemplate(template)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded transition cursor-pointer"
                    >
                      Editar Modelo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Viewer Modal */}
      <ResponsibilityTermViewerModal
        termId={viewerTermId}
        onClose={() => setViewerTermId(null)}
      />

      {/* Template Form Modal */}
      <ResponsibilityTermTemplateFormModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templateToEdit={templateToEdit}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};
