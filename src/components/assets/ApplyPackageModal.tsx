import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { Modal } from '../common/Modal';
import { Asset, Credential } from '../../types';
import { Package, Plus, Trash2, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ApplyPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

export const ApplyPackageModal: React.FC<ApplyPackageModalProps> = ({ isOpen, onClose, asset }) => {
  const { packages, applyPackageToAsset, addToast } = useInventy();

  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[0]?.id || '');
  const [observacaoGeral, setObservacaoGeral] = useState<string>('');

  // Credentials fields
  const [credentials, setCredentials] = useState<Array<Omit<Credential, 'id' | 'packageApplicationId'>>>([
    {
      nome: 'AnyDesk Access ID & Senha',
      identificador: '984 201 334',
      valorProtegido: 'Tech2026#UnattendedPass',
      observacao: 'Acesso remoto não supervisionado para equipe de T.I.',
    },
  ]);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId);

  const handleAddCredential = () => {
    setCredentials((prev) => [
      ...prev,
      {
        nome: '',
        identificador: '',
        valorProtegido: '',
        observacao: '',
      },
    ]);
  };

  const handleRemoveCredential = (index: number) => {
    setCredentials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCredentialChange = (index: number, field: string, value: string) => {
    setCredentials((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageId) {
      addToast('error', 'Selecione um Pacote', 'É necessário escolher um pacote de aplicação.');
      return;
    }

    applyPackageToAsset(asset.id, selectedPackageId, observacaoGeral, credentials);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600" />
          <span>Aplicar Pacote de Aplicação</span>
        </div>
      }
      subtitle={`Vincular snapshot de software ao ativo ${asset.patrimonio} (${asset.nome})`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Package Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Selecione o Modelo de Pacote de Aplicação *
          </label>
          <select
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
          >
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.nome} (v{pkg.versao}) — {pkg.itens.length} itens incluídos
              </option>
            ))}
          </select>
        </div>

        {/* Package Items Preview (Snapshot Notice) */}
        {selectedPkg && (
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Itens a serem registrados na fotografia histórica:
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-semibold">
                Fotografia Histórica Independente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {selectedPkg.itens.map((item) => (
                <div key={item.id} className="p-2 rounded border border-slate-200/80 bg-white text-xs flex items-center justify-between">
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{item.nome}</p>
                    <p className="text-[10px] text-slate-400">{item.categoria} {item.versao ? `• v${item.versao}` : ''}</p>
                  </div>
                  {item.obrigatorio && (
                    <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                      Obrigatório
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 italic mt-1">
              * Nota: A aplicação criará uma fotografia congelada destes itens. Alterações futuras no pacote não modificarão este registro.
            </p>
          </div>
        )}

        {/* Credentials Section */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                Credenciais de Acesso da Aplicação
              </h4>
              <p className="text-[11px] text-slate-500">
                Defina identificadores e senhas protegidas vinculadas a esta aplicação do pacote no ativo.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCredential}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Credencial
            </button>
          </div>

          <div className="space-y-3">
            {credentials.map((cred, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white space-y-2.5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Credencial #{idx + 1}</span>
                  {credentials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCredential(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Nome / Serviço *</label>
                    <input
                      type="text"
                      placeholder="Ex: AnyDesk Access ID / VPN Token"
                      value={cred.nome}
                      onChange={(e) => handleCredentialChange(idx, 'nome', e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Usuário / ID Opcional</label>
                    <input
                      type="text"
                      placeholder="Ex: 123 456 789 / user.corp"
                      value={cred.identificador || ''}
                      onChange={(e) => handleCredentialChange(idx, 'identificador', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Senha / Valor Protegido *
                    </label>
                    <input
                      type="password"
                      placeholder="Senha protegida..."
                      value={cred.valorProtegido}
                      onChange={(e) => handleCredentialChange(idx, 'valorProtegido', e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Observação</label>
                    <input
                      type="text"
                      placeholder="Ex: Acesso apenas suporte N2"
                      value={cred.observacao || ''}
                      onChange={(e) => handleCredentialChange(idx, 'observacao', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Observacao */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">Observação Geral da Aplicação</label>
          <textarea
            rows={2}
            value={observacaoGeral}
            onChange={(e) => setObservacaoGeral(e.target.value)}
            placeholder="Ex: Instalação efetuada durante a homologação do equipamento..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Footer Actions */}
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
            Registrar Aplicação de Pacote
          </button>
        </div>
      </form>
    </Modal>
  );
};
