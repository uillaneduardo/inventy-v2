import React from 'react';
import { Modal } from '../common/Modal';
import { TermSnapshotData } from '../../types';
import { ResponsibilityTermDocument } from './ResponsibilityTermDocument';
import { Printer, Download, CheckCircle, ShieldAlert } from 'lucide-react';

interface ResponsibilityTermPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: TermSnapshotData | null;
  code?: string;
  onConfirmPrint?: () => void;
}

export const ResponsibilityTermPreviewModal: React.FC<ResponsibilityTermPreviewModalProps> = ({
  isOpen,
  onClose,
  snapshot,
  code,
  onConfirmPrint,
}) => {
  if (!snapshot) return null;

  const handlePrint = () => {
    window.print();
    if (onConfirmPrint) onConfirmPrint();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pré-visualização do Termo de Responsabilidade (A4)"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Action Header Banner */}
        <div className="bg-slate-900 text-white p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-md">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Documento Pronto para Emissão</p>
              <p className="text-[11px] text-slate-300">
                Formato A4 padrão corporativo com assinaturas e dados validados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Gerar PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="overflow-y-auto max-h-[75vh] bg-slate-100 p-4 rounded-xl border border-slate-200 print:p-0 print:bg-white print:max-h-none">
          <ResponsibilityTermDocument snapshot={snapshot} code={code} />
        </div>

        {/* Modal Actions Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};
