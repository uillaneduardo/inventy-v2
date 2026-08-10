import React from 'react';
import { LocationItem, Asset } from '../../types';
import { calculateAggregatedStats } from '../../utils/locationUtils';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

interface LocationMapMarkerPopupProps {
  location: LocationItem;
  assets: Asset[];
  onSelectLocation: (locationId: string) => void;
}

export const LocationMapMarkerPopup: React.FC<LocationMapMarkerPopupProps> = ({
  location,
  assets,
  onSelectLocation,
}) => {
  const stats = calculateAggregatedStats(location, assets);

  return (
    <div className="p-3 max-w-[260px] font-sans text-neutral-900 w-full">
      {/* Header */}
      <div className="flex items-start gap-2 pb-2.5 mb-2.5 border-b border-neutral-200/80">
        <div className="p-1.5 bg-neutral-100 rounded-lg text-emerald-600 shrink-0 border border-neutral-200/60">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-xs text-neutral-900 leading-snug truncate">{location.nome}</h3>
          {location.endereco && (
            <p className="text-[10px] text-neutral-500 mt-0.5 flex items-start gap-1">
              <MapPin className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
              <span className="truncate">{location.endereco}</span>
            </p>
          )}
        </div>
      </div>

      {/* Asset Summary Stat */}
      <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-200/80 mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium text-neutral-600">Ativos Agregados:</span>
        <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-2xs">
          {stats.totalAssets} ativos
        </span>
      </div>

      {/* Status Breakdown */}
      <div className="space-y-1.5 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
          Status dos Ativos
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200/80 px-2 py-1 rounded text-blue-900">
            <span className="font-medium">Em uso</span>
            <span className="font-mono font-bold">{stats.statusBreakdown['Em uso']}</span>
          </div>
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 px-2 py-1 rounded text-emerald-900">
            <span className="font-medium">Disponível</span>
            <span className="font-mono font-bold">{stats.statusBreakdown['Disponível']}</span>
          </div>
          <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 px-2 py-1 rounded text-amber-900">
            <span className="font-medium">Manutenção</span>
            <span className="font-mono font-bold">{stats.statusBreakdown['Em manutenção']}</span>
          </div>
          <div className="flex items-center justify-between bg-neutral-100 border border-neutral-200 px-2 py-1 rounded text-neutral-700">
            <span className="font-medium">Descartado</span>
            <span className="font-mono font-bold">{stats.statusBreakdown['Descartado']}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelectLocation(location.id)}
        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
      >
        <span>Ver na árvore</span>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
      </button>
    </div>
  );
};
