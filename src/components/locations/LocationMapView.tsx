import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import { useInventy } from '../../context/InventyContext';
import { findLocationsWithCoords, calculateAggregatedStats } from '../../utils/locationUtils';
import { LocationMapMarkerPopup } from './LocationMapMarker';
import { MapPin, Navigation, Info, Building2 } from 'lucide-react';

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

    // Clean up old map instance if re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center (e.g. São Paulo / Southeast region)
    const initialLat = mappedLocations.length > 0 ? mappedLocations[0].latitude! : -23.5505;
    const initialLng = mappedLocations.length > 0 ? mappedLocations[0].longitude! : -46.6333;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 6,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const bounds = L.latLngBounds([]);

    // Add Markers for Mapped Locations
    mappedLocations.forEach((loc) => {
      if (loc.latitude === undefined || loc.longitude === undefined) return;

      const latLng: [number, number] = [loc.latitude, loc.longitude];
      bounds.extend(latLng);

      const stats = calculateAggregatedStats(loc, assets);

      // Create Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-inventy-marker',
        html: `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #0f172a;
            color: #ffffff;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            padding: 5px 10px;
            border-radius: 8px;
            border: 1px solid #334155;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            cursor: pointer;
            white-space: nowrap;
            transform: translate(-50%, -100%);
            transition: all 0.2s ease;
          " class="marker-hover-effect">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 9999px;
              background-color: #34d399;
              box-shadow: 0 0 6px #34d399;
              display: inline-block;
            "></span>
            <span style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;">${loc.nome}</span>
            <span style="
              background-color: #1e293b;
              color: #34d399;
              font-family: monospace;
              font-size: 10px;
              font-weight: 700;
              padding: 1px 6px;
              border-radius: 4px;
              border: 1px solid #334155;
            ">${stats.totalAssets} ativos</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      // Create container element for React Popup content
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

    // Fit map bounds if multiple locations exist
    if (mappedLocations.length > 1) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
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
      <div className="relative w-full h-[540px] rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top Floating Control Bar */}
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Mapped Units Counter */}
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-md text-xs font-semibold flex items-center gap-2 pointer-events-auto">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{mappedLocations.length} Localizações no Mapa</span>
          </div>

          {/* Location Quick Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 pointer-events-auto">
            {mappedLocations.map((loc) => {
              const stats = calculateAggregatedStats(loc, assets);
              return (
                <button
                  key={loc.id}
                  onClick={() => handlePanToLocation(loc)}
                  className="bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-2xs flex items-center gap-1.5 transition-all hover:border-slate-300 cursor-pointer shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{loc.nome}</span>
                  <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">
                    {stats.totalAssets}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Info Banner */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs text-[11px] text-slate-600 flex items-center gap-1.5 pointer-events-auto">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Clique em um marcador para ver o detalhamento de ativos e navegar até a estrutura hierárquica.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
