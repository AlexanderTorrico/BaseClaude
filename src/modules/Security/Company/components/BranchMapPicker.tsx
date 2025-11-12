import React, { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Input, FormGroup, Label, Row, Col } from 'reactstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para el icono por defecto de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface BranchMapPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
}

const defaultCenter: [number, number] = [-17.783889, -63.182129];

// Componente interno para manejar eventos del mapa
const MapEventsHandler: React.FC<{
  onPositionChange: (lat: number, lng: number) => void;
}> = ({ onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const BranchMapPicker: React.FC<BranchMapPickerProps> = ({
  initialLat,
  initialLng,
  onLocationChange,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    initialLat || defaultCenter[0],
    initialLng || defaultCenter[1],
  ]);

  const [manualLat, setManualLat] = useState<string>(
    (initialLat || defaultCenter[0]).toFixed(6)
  );
  const [manualLng, setManualLng] = useState<string>(
    (initialLng || defaultCenter[1]).toFixed(6)
  );

  const markerRef = useRef<L.Marker>(null);

  const handlePositionChange = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    setManualLat(lat.toFixed(6));
    setManualLng(lng.toFixed(6));
    onLocationChange(lat, lng);
  };

  const handleMarkerDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const position = marker.getLatLng();
      handlePositionChange(position.lat, position.lng);
    }
  };

  const handleManualLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualLat(value);

    const lat = parseFloat(value);
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      const lng = parseFloat(manualLng);
      if (!isNaN(lng)) {
        setMarkerPosition([lat, lng]);
        onLocationChange(lat, lng);
      }
    }
  };

  const handleManualLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualLng(value);

    const lng = parseFloat(value);
    if (!isNaN(lng) && lng >= -180 && lng <= 180) {
      const lat = parseFloat(manualLat);
      if (!isNaN(lat)) {
        setMarkerPosition([lat, lng]);
        onLocationChange(lat, lng);
      }
    }
  };

  const mapCenter = useMemo(() => markerPosition, [markerPosition]);

  return (
    <div>
      {/* Inputs manuales de coordenadas */}
      <Row className="mb-3">
        <Col md={6}>
          <FormGroup>
            <Label for="manual-lat">Latitud</Label>
            <Input
              type="number"
              id="manual-lat"
              step="0.000001"
              value={manualLat}
              onChange={handleManualLatChange}
              placeholder="-17.783889"
            />
            <small className="text-muted">Rango: -90 a 90</small>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="manual-lng">Longitud</Label>
            <Input
              type="number"
              id="manual-lng"
              step="0.000001"
              value={manualLng}
              onChange={handleManualLngChange}
              placeholder="-63.182129"
            />
            <small className="text-muted">Rango: -180 a 180</small>
          </FormGroup>
        </Col>
      </Row>

      {/* Mapa de Leaflet */}
      <div style={{ height: '400px', width: '100%', marginBottom: '1rem' }}>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={markerPosition}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
            ref={markerRef}
          />
          <MapEventsHandler onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>

      <div className="text-muted small">
        <i className="mdi mdi-information me-1"></i>
        <strong>Instrucciones:</strong>
        <ul className="mb-0 mt-1">
          <li>Haz clic en el mapa para colocar el marcador</li>
          <li>Arrastra el marcador a la ubicación deseada</li>
          <li>O ingresa las coordenadas manualmente</li>
        </ul>
      </div>
    </div>
  );
};

export default BranchMapPicker;
