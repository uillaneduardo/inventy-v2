import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import { useInventy } from '../../context/InventyContext';
import { findLocationsWithCoords, calculateAggregatedStats } from '../../utils/locationUtils';
import { LocationMapMarkerPopup } from './LocationMapMarker';
import { MapPin, Info, Building2 } from 'lucide-react';

interface LocationMapViewProps {
  onSelectLocation: (locationId: string) => void;
}

export const LocationMapView: React.FC<LocationMapViewProps> = ({ onSelectLocation }) => {
  const { locations, assets } = useInventy();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const mappedLocations = findLocationsWithCoords(locations);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = mappedLocations.length > 0 ? mappedLocations[0].latitude! : -23.5505;
    const initialLng = mappedLocations.length > 0 ? mappedLocations[0].longitude! : -46.6333;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 6,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds = L.latLngBounds([]);

    mappedLocations.forEach((loc) => {
      if (loc.latitude === undefined || loc.longitude === undefined) return;

      const latLng: [number, number] = [loc.latitude, loc.longitude];
      bounds.extend(latLng);

      const stats = calculateAggregatedStats(loc, assets);

      // Clean Light B2B SaaS Marker Icon (White background, subtle border, dark text, emerald accent)
      const customIcon = L.divIcon({
        className: 'custom-inventy-marker',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ffffff;
            color: #111827;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            padding: 5px 10px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            cursor: pointer;
            white-space: nowrap;
            transform: translate(-50%, -100%);
            transition: all 0.2s ease;
          " class="marker-hover-effect">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 9999px;
              background-color: #10b981;
              box-shadow: 0 0 4px #10b981;
              display: inline-block;
            "></span>
            <span style="max-width: 140px; overflow: hidden; text-overflow: ellipsis;">${loc.nome}</span>
            <span style="
              background-color: #f3f4f6;
              color: #047857;
              font-family: monospace;
              font-size: 10px;
              font-weight: 700;
              padding: 1px 6px;
              border-radius: 4px;
              border: 1px solid #e5e7eb;
            ">${stats.totalAssets} ativos</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      const popupNode = document.createElement('div');
      const root = createRoot(popupNode);

      root.render(
        <LocationMapMarkerPopup
          location={loc}
          assets={assets}
          onSelectLocation={(id) => {
            map.closePopup();
            onSelectLocation(id);
          }}
        />
      );

      marker.bindPopup(popupNode, {
        maxWidth: 280,
        className: 'inventy-leaflet-popup',
      });
    });

    if (mappedLocations.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    } else if (mappedLocations.length === 1) {
      map.setView([mappedLocations[0].latitude!, mappedLocations[0].longitude!], 11);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, assets, onSelectLocation]);

  const handlePanToLocation = (loc: typeof mappedLocations[0]) => {
    if (mapInstanceRef.current && loc.latitude !== undefined && loc.longitude !== undefined) {
      mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 12, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-3">
      {/* Map Card */}
      <div className="relative w-full h-[400px] sm:h-[520px] rounded-xl border border-neutral-200/80 shadow-2xs overflow-hidden bg-neutral-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top Floating Control Bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Mapped Units Counter */}
          <div className="bg-white/95 backdrop-blur-md text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200/90 shadow-sm text-xs font-semibold flex items-center gap-2 pointer-events-auto">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>{mappedLocations.length} Unidades no Mapa</span>
          </div>

          {/* Location Quick Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 pointer-events-auto">
            {mappedLocations.map((loc) => {
              const stats = calculateAggregatedStats(loc, assets);
              return (
                <button
                  key={loc.id}
                  onClick={() => handlePanToLocation(loc)}
                  className="bg-white/95 hover:bg-white text-neutral-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs flex items-center gap-1.5 transition-all hover:border-neutral-300 cursor-pointer shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{loc.nome}</span>
                  <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded font-bold text-neutral-700">
                    {stats.totalAssets}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Info Banner */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto z-10 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-200/80 shadow-xs text-[11px] text-neutral-600 flex items-center gap-1.5 pointer-events-auto max-w-md">
            <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">
              Toque nos marcadores para ver ativos agregados e navegar para a estrutura.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
