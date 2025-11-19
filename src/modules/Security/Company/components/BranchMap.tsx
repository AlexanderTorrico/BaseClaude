import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { BranchModel } from '../models/CompanyModel';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configurar iconos por defecto
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface BranchMapProps {
  branches: BranchModel[];
  selectedBranchId?: number | null;
  onBranchSelect?: (branchId: number) => void;
  onBranchMove?: (branchId: number, lat: number, lng: number) => void;
  draggableMarkers?: boolean;
  height?: string;
}

/**
 * Componente auxiliar para auto-zoom del mapa
 */
const AutoZoom: React.FC<{ branches: BranchModel[] }> = ({ branches }) => {
  const map = useMap();

  useEffect(() => {
    const branchesWithCoords = branches.filter(b => b.lat !== null && b.lng !== null);

    if (branchesWithCoords.length === 0) {
      // Default: Santa Cruz, Bolivia
      map.setView([-17.783327, -63.182140], 13);
      return;
    }

    if (branchesWithCoords.length === 1) {
      const branch = branchesWithCoords[0];
      map.setView([branch.lat!, branch.lng!], 15);
      return;
    }

    // Múltiples sucursales: ajustar zoom para mostrar todas
    const bounds = L.latLngBounds(
      branchesWithCoords.map(b => [b.lat!, b.lng!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [branches, map]);

  return null;
};

/**
 * Componente auxiliar para enfocar el mapa cuando se selecciona una sucursal
 */
const FocusOnSelected: React.FC<{ branches: BranchModel[]; selectedBranchId: number | null }> = ({
  branches,
  selectedBranchId,
}) => {
  const map = useMap();
  const prevBranchesRef = useRef<BranchModel[]>(branches);

  useEffect(() => {
    if (selectedBranchId === null) return;

    const selectedBranch = branches.find(b => b.id === selectedBranchId);
    if (!selectedBranch || selectedBranch.lat === null || selectedBranch.lng === null) return;

    // Verificar si las coordenadas del branch seleccionado cambiaron
    const prevBranch = prevBranchesRef.current.find(b => b.id === selectedBranchId);
    const coordinatesChanged = prevBranch &&
      (prevBranch.lat !== selectedBranch.lat || prevBranch.lng !== selectedBranch.lng);

    // Actualizar la referencia
    prevBranchesRef.current = branches;

    const targetZoom = 17;

    // Si las coordenadas cambiaron (marker arrastrado), esperar un poco antes de centrar
    const delay = coordinatesChanged ? 200 : 0;

    setTimeout(() => {
      // Centrar el mapa en las coordenadas exactas
      // Usar flyTo para una animación suave que garantiza el centrado
      map.flyTo([selectedBranch.lat!, selectedBranch.lng!], targetZoom, {
        animate: true,
        duration: coordinatesChanged ? 0.5 : 1, // Animación más rápida si fue arrastrado
      });
    }, delay);
  }, [selectedBranchId, branches, map]);

  return null;
};

/**
 * Componente Mapa de Sucursales con Leaflet
 */
const BranchMap: React.FC<BranchMapProps> = ({
  branches,
  selectedBranchId = null,
  onBranchSelect,
  onBranchMove,
  draggableMarkers = false,
  height = '500px',
}) => {
  const branchesWithCoords = branches.filter(b => b.lat !== null && b.lng !== null);
  const markerRefs = useRef<{ [key: number]: L.Marker | null }>({});

  // Color del marker según si está seleccionado
  const createCustomIcon = (isSelected: boolean): L.DivIcon => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <i class="mdi mdi-map-marker" style="
          font-size: 2.5rem;
          color: ${isSelected ? '#f46a6a' : '#556ee6'};
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: block;
          line-height: 1;
        "></i>
      `,
      iconSize: [25, 41],
      iconAnchor: [12.5, 41],
      popupAnchor: [0, -41],
    });
  };

  const handleMarkerDragEnd = (branchId: number, event: L.DragEndEvent) => {
    const marker = event.target;
    const position = marker.getLatLng();
    onBranchMove?.(branchId, position.lat, position.lng);
  };

  if (branchesWithCoords.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light border rounded"
        style={{ height }}
      >
        <div className="text-center text-muted p-4">
          <i className="mdi mdi-map-marker-off" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 mb-0">
            No hay sucursales con ubicación definida
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            Agrega coordenadas a las sucursales para visualizarlas en el mapa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }} className="border rounded overflow-hidden">
      <MapContainer
        center={[-17.783327, -63.182140]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoZoom branches={branchesWithCoords} />
        <FocusOnSelected branches={branches} selectedBranchId={selectedBranchId} />

        {branchesWithCoords.map(branch => {
          const isSelected = selectedBranchId === branch.id;

          return (
            <Marker
              key={branch.id}
              position={[branch.lat!, branch.lng!]}
              icon={createCustomIcon(isSelected)}
              draggable={draggableMarkers}
              eventHandlers={{
                click: () => onBranchSelect?.(branch.id),
                dragend: (e) => handleMarkerDragEnd(branch.id, e),
              }}
              ref={(ref) => {
                markerRefs.current[branch.id] = ref;
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h6 className="mb-2">
                    <i className="mdi mdi-map-marker text-danger me-1"></i>
                    {branch.name}
                  </h6>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    <p className="mb-1">
                      <i className="mdi mdi-phone me-1"></i>
                      {branch.phone}
                    </p>
                    {branch.email && (
                      <p className="mb-1">
                        <i className="mdi mdi-email me-1"></i>
                        {branch.email}
                      </p>
                    )}
                    <p className="mb-1">
                      <i className="mdi mdi-map-marker-outline me-1"></i>
                      {branch.address}
                    </p>
                    <p className="mb-0 mt-2 text-info">
                      <small>
                        Lat: {branch.lat!.toFixed(6)}, Lng: {branch.lng!.toFixed(6)}
                      </small>
                    </p>
                    {draggableMarkers && (
                      <p className="mb-0 mt-2 text-warning">
                        <small>
                          <i className="mdi mdi-cursor-move me-1"></i>
                          Arrastra el marker para cambiar ubicación
                        </small>
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default BranchMap;
