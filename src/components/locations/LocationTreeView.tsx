import React, { useState, useEffect, useRef } from 'react';
import { useInventy } from '../../context/InventyContext';
import { Modal } from '../common/Modal';
import { LocationItem, LocationType } from '../../types';
import { findParentPathIds } from '../../utils/locationUtils';
import { MapPin, Building2, Building, Layers, DoorClosed, Plus, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LocationTreeViewProps {
  highlightedLocationId?: string | null;
  hideHeader?: boolean;
  onAddLocationClick?: () => void;
}

export const LocationTreeView: React.FC<LocationTreeViewProps> = ({
  highlightedLocationId,
  hideHeader = false,
  onAddLocationClick,
}) => {
  const { locations, addLocation, currentOrg } = useInventy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<LocationType>('sala');
  const [endereco, setEndereco] = useState('');
  const [responsavel, setResponsavel] = useState('');

  // Expand state for accordion
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'loc-sp': true,
    'loc-sp-pa': true,
    'loc-sp-pa-a4': true,
    'loc-rj': true,
  });

  const highlightedRef = useRef<HTMLDivElement | null>(null);

  // Auto-expand path to highlightedLocationId if provided
  useEffect(() => {
    if (!highlightedLocationId) return;

    const parentPath = findParentPathIds(locations, highlightedLocationId);
    if (parentPath.length > 0) {
      setExpanded((prev) => {
        const next = { ...prev };
        parentPath.forEach((id) => {
          next[id] = true;
        });
        return next;
      });

      // Scroll into view after render
      setTimeout(() => {
        if (highlightedRef.current) {
          highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [highlightedLocationId, locations]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTypeIcon = (type: LocationType) => {
    switch (type) {
      case 'unidade':
        return <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'predio':
        return <Building className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'andar':
        return <Layers className="w-4 h-4 text-teal-600 shrink-0" />;
      case 'sala':
        return <DoorClosed className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const renderNode = (item: LocationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = !!expanded[item.id];
    const isHighlighted = item.id === highlightedLocationId;

    return (
      <div key={item.id} className="space-y-1">
        <div
          ref={isHighlighted ? highlightedRef : null}
          onClick={() => hasChildren && toggleExpand(item.id)}
          className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${
            isHighlighted
              ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs'
              : 'border-slate-200/80 bg-white hover:bg-slate-50'
          } ${level > 0 ? 'ml-5' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              )
            ) : (
              <span className="w-4 shrink-0" />
            )}

            {renderTypeIcon(item.tipo)}

            <div>
              <span className={`font-bold ${isHighlighted ? 'text-indigo-950' : 'text-slate-900'}`}>
                {item.nome}
              </span>
              {item.endereco && <span className="text-[10px] text-slate-400 block">{item.endereco}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            {item.responsavel && (
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                Resp: {item.responsavel}
              </span>
            )}
            {item.assetCount !== undefined && (
              <span className="font-mono text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {item.assetCount} Ativos
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1 border-l-2 border-slate-200 ml-4 pl-1">
            {item.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleOpenModal = () => {
    if (onAddLocationClick) {
      onAddLocationClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-5">
      {/* Optional Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Estrutura de Localizações</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Hierarquia flexível: Organização → Unidade → Prédio → Andar → Sala/Setor para <strong className="text-slate-700">{currentOrg.name}</strong>
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Adicionar Localização
          </button>
        </div>
      )}

      {/* Tree View Container */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
        {locations.map((loc) => renderNode(loc, 0))}
      </div>

      {/* Modal: New Location */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Nova Localização"
        subtitle="Cadastrar unidade, prédio, andar ou sala no mapa patrimonial"
        maxWidth="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addLocation({
              nome,
              tipo,
              endereco,
              responsavel,
              assetCount: 0,
            });
            setIsModalOpen(false);
            setNome('');
            setEndereco('');
            setResponsavel('');
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Tipo de Localização *</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as LocationType)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
            >
              <option value="unidade">Unidade (Filial / Sede)</option>
              <option value="predio">Prédio / Bloco</option>
              <option value="andar">Andar / Pavimento</option>
              <option value="sala">Sala / Setor / Laboratório</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Nome / Identificação *</label>
            <input
              type="text"
              placeholder="Ex: Sala 502 - Laboratório de P&D"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Endereço (opcional)</label>
            <input
              type="text"
              placeholder="Ex: Av. Paulista, 1000"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Responsável Local</label>
            <input
              type="text"
              placeholder="Ex: Carlos Eduardo"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
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
              Salvar Localização
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
