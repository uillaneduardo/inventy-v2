import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { Modal } from '../common/Modal';
import { Asset, MovementType } from '../../types';
import { ArrowLeftRight, UserCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface AssetMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

export const AssetMovementModal: React.FC<AssetMovementModalProps> = ({ isOpen, onClose, asset }) => {
  const { collaborators, registerMovement, addToast } = useInventy();

  const [tipo, setTipo] = useState<MovementType>('Atribuição');
  const [novoResponsavelId, setNovoResponsavelId] = useState<string>(collaborators[0]?.id || '');
  const [motivo, setMotivo] = useState<string>('');

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

    registerMovement({
      assetId: asset.id,
      tipo,
      novoResponsavelId: tipo === 'Devolução' ? undefined : novoResponsavelId,
      motivo,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Confirmar Movimentação
          </button>
        </div>
      </form>
    </Modal>
  );
};
