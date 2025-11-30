import React from 'react';
import { Button } from 'reactstrap';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onCreateZone: () => void;
  onCreateTable: () => void;
}

const Header: React.FC<HeaderProps> = ({
  loading,
  onRefresh,
  onCreateZone,
  onCreateTable,
}) => {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-1">Configuración de Zonas y Mesas</h4>
          <p className="text-muted mb-0">
            Gestiona las zonas del restaurante y la posición de las mesas
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button color="light" onClick={onRefresh} disabled={loading}>
            <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''} me-1`}></i>
            Actualizar
          </Button>
          <Button color="primary" onClick={onCreateZone}>
            <i className="mdi mdi-map-marker-plus me-1"></i>
            Nueva Zona
          </Button>
          <Button color="success" onClick={onCreateTable}>
            <i className="mdi mdi-table-furniture me-1"></i>
            Nueva Mesa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
