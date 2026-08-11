import React, { useState, useEffect } from 'react';
import { useInventy } from '../../context/InventyContext';
import { Modal } from '../common/Modal';
import { Asset, MovementType } from '../../types';
import { ResponsibilityTermViewerModal } from '../responsibility-terms/ResponsibilityTermViewerModal';
import { ArrowLeftRight, CheckCircle2, FileCheck2, AlertCircle } from 'lucide-react';

interface AssetMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

export const AssetMovementModal: React.FC<AssetMovementModalProps> = ({ isOpen, onClose, asset }) => {
  const { collaborators, termTemplates, registerMovement, addToast } = useInventy();

  const [tipo, setTipo] = useState<MovementType>('Atribuição');
  const [novoResponsavelId, setNovoResponsavelId] = useState<string>(collaborators[0]?.id || '');
  const [motivo, setMotivo] = useState<string>('');
  const [gerarTermo, setGerarTermo] = useState<boolean>(true);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(
    (asset.acessorios || []).map((a) => a.id)
  );

  // Filter templates: active and compatible with selected movement type
  const validTemplates = termTemplates.filter(
    (t) => t.ativo && t.tiposMovimentacao.includes(tipo)
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    validTemplates[0]?.id || ''
  );

  const [createdTermId, setCreatedTermId] = useState<string | null>(null);

  // Keep selectedTemplateId synchronized with available valid templates for selected movement type
  useEffect(() => {
    if (validTemplates.length > 0) {
      if (!validTemplates.some((t) => t.id === selectedTemplateId)) {
        setSelectedTemplateId(validTemplates[0].id);
      }
    } else {
      setSelectedTemplateId('');
    }
  }, [tipo, termTemplates]);

  const toggleAccessory = (id: string) => {
    if (selectedAccessories.includes(id)) {
      setSelectedAccessories(selectedAccessories.filter((accId) => accId !== id));
    } else {
      setSelectedAccessories([...selectedAccessories, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo === 'Atribuição' && !novoResponsavelId) {
      addToast('error', 'Selecione um Colaborador', 'Para atribuição, informe o colaborador responsável.');
      return;
    }
    if (!motivo.trim()) {
      addToast('error', 'Motivo Obrigatório', 'Informe o motivo ou observação da movimentação.');
      return;
    }

    const canGenerateTerm = gerarTermo && validTemplates.length > 0;

    const termId = registerMovement({
      assetId: asset.id,
      tipo,
      novoResponsavelId: tipo === 'Devolução' ? undefined : novoResponsavelId,
      motivo,
      acessoriosSelecionados: selectedAccessories,
      templateId: selectedTemplateId,
      generateResponsibilityTerm: canGenerateTerm,
    });

    if (termId && canGenerateTerm) {
      setCreatedTermId(termId);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !createdTermId}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
            <span>Registrar Movimentação de Ativo</span>
          </div>
        }
        subtitle={`Movimentar ativo ${asset.patrimonio} (${asset.nome})`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Movimentação */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Tipo de Movimentação *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Atribuição', 'Devolução', 'Transferência'] as MovementType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
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

          {/* Current State Summary */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
            <p className="text-slate-500">
              <strong>Responsável Atual:</strong> {asset.responsavelNome || 'Nenhum (Disponível no estoque)'}
            </p>
            <p className="text-slate-500 truncate">
              <strong>Localização:</strong> {asset.locationPath}
            </p>
          </div>

          {/* Target Responsible */}
          {tipo !== 'Devolução' && (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Novo Responsável (Colaborador) *
              </label>
              <select
                value={novoResponsavelId}
                onChange={(e) => setNovoResponsavelId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                <option value="">Selecione o colaborador...</option>
                {collaborators.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.nome} — {col.cargo} ({col.departamento})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Accessories Checklist */}
          {asset.acessorios && asset.acessorios.length > 0 && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Acessórios Entregues / Devolvidos no Termo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {asset.acessorios.map((acc) => {
                  const checked = selectedAccessories.includes(acc.id);
                  return (
                    <label key={acc.id} className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border border-slate-200">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAccessory(acc.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-[11px] font-medium text-slate-800">{acc.nome}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Motivo */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Motivo / Observação *</label>
            <textarea
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Entrega de equipamento corporativo após admissão do colaborador..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Gerar Termo Option */}
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-950">Gerar Termo de Responsabilidade (A4)</p>
                  <p className="text-[10px] text-emerald-800">
                    Cria o documento oficial com os dados do colaborador, ativo e data.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={gerarTermo}
                onChange={(e) => setGerarTermo(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Model Selection if gerarTermo is checked */}
            {gerarTermo && (
              <div className="pt-2 border-t border-emerald-200/60">
                {validTemplates.length > 0 ? (
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">
                      Modelo do Termo *
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {validTemplates.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Nenhum modelo de termo ativo disponível para {tipo}. A movimentação será registrada sem geração de termo.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {gerarTermo && validTemplates.length > 0 ? 'Confirmar & Gerar Termo' : 'Confirmar Movimentação'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Viewing Generated Term */}
      {createdTermId && (
        <ResponsibilityTermViewerModal
          termId={createdTermId}
          onClose={() => {
            setCreatedTermId(null);
            onClose();
          }}
        />
      )}
    </>
  );
};
