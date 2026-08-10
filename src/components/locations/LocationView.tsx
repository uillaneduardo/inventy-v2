import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { LocationTreeView } from './LocationTreeView';
import { LocationMapView } from './LocationMapView';
import { Modal } from '../common/Modal';
import { LocationType } from '../../types';
import { FolderTree, Map, Plus, CheckCircle2 } from 'lucide-react';

export const LocationView: React.FC = () => {
  const { currentOrg, addLocation } = useInventy();
  const [viewMode, setViewMode] = useState<'estrutura' | 'mapa'>('estrutura');
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for New Location
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<LocationType>('sala');
  const [endereco, setEndereco] = useState('');
  const [responsavel, setResponsavel] = useState('');

  const handleSelectLocationFromMap = (locationId: string) => {
    setHighlightedLocationId(locationId);
    setViewMode('estrutura');
  };

  return (
    <div className="space-y-5">
      {/* Module Header with Compact View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Estrutura de Localizações</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarquia flexível: Organização → Unidade → Prédio → Andar → Sala/Setor para{' '}
            <strong className="text-slate-700">{currentOrg.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Compact Selector [ Estrutura ] [ Mapa ] */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setViewMode('estrutura')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'estrutura'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Estrutura</span>
            </button>
            <button
              onClick={() => setViewMode('mapa')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'mapa'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Mapa</span>
            </button>
          </div>

          {/* Add Location Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Adicionar Localização</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'estrutura' ? (
        <LocationTreeView
          hideHeader
          highlightedLocationId={highlightedLocationId}
          onAddLocationClick={() => setIsModalOpen(true)}
        />
      ) : (
        <LocationMapView onSelectLocation={handleSelectLocationFromMap} />
      )}

      {/* Shared Modal: Add New Location */}
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
