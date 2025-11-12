import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Badge, Tooltip } from 'reactstrap';
import { Table, TableStatus } from '../models/TableModel';
import { Users } from 'lucide-react';

interface TableLayoutMapProps {
  tables: Table[];
  onTableClick?: (table: Table) => void;
  selectedTableId?: number;
}

// Dimensiones base del canvas
const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

const TableLayoutMap: React.FC<TableLayoutMapProps> = ({
  tables,
  onTableClick,
  selectedTableId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: number]: boolean }>({});

  // Calcular escala responsiva
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(containerWidth / BASE_WIDTH, 1);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Obtener color según estado
  const getStatusColor = (status: TableStatus): string => {
    const colors: Record<TableStatus, string> = {
      Available: '#28a745',      // Verde
      Reserved: '#17a2b8',        // Azul
      Occupied: '#ffc107',        // Amarillo
      Cleaning: '#6c757d',        // Gris
      Maintenance: '#dc3545'      // Rojo
    };
    return colors[status];
  };

  // Obtener color de borde si está seleccionada
  const getBorderColor = (tableId: number): string => {
    return selectedTableId === tableId ? '#007bff' : '#333';
  };

  // Renderizar mesa según su forma
  const renderTable = (table: Table) => {
    const x = (table.x || 0) * scale;
    const y = (table.y || 0) * scale;
    const size = 60 * scale; // Tamaño base de la mesa
    const color = getStatusColor(table.status);
    const borderColor = getBorderColor(table.id);
    const borderWidth = selectedTableId === table.id ? 3 : 2;
    const isHovered = hoveredTable?.id === table.id;

    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      backgroundColor: color,
      border: `${borderWidth}px solid ${borderColor}`,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: `${12 * scale}px`,
      transition: 'all 0.2s ease',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: isHovered ? 10 : 1,
    };

    const handleClick = () => {
      if (onTableClick) {
        onTableClick(table);
      }
    };

    const handleMouseEnter = () => {
      setHoveredTable(table);
    };

    const handleMouseLeave = () => {
      setHoveredTable(null);
    };

    // Renderizar según forma
    switch (table.shape) {
      case 'round':
        return (
          <div
            key={table.id}
            id={`table-${table.id}`}
            style={{
              ...commonStyle,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>{table.table_number}</div>
            <div style={{ fontSize: `${10 * scale}px`, marginTop: '2px' }}>
              <Users size={10 * scale} style={{ display: 'inline', marginRight: '2px' }} />
              {table.capacity}
            </div>
          </div>
        );

      case 'square':
        return (
          <div
            key={table.id}
            id={`table-${table.id}`}
            style={{
              ...commonStyle,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '8px',
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>{table.table_number}</div>
            <div style={{ fontSize: `${10 * scale}px`, marginTop: '2px' }}>
              <Users size={10 * scale} style={{ display: 'inline', marginRight: '2px' }} />
              {table.capacity}
            </div>
          </div>
        );

      case 'rectangle':
        return (
          <div
            key={table.id}
            id={`table-${table.id}`}
            style={{
              ...commonStyle,
              width: `${size * 1.5}px`,
              height: `${size * 0.7}px`,
              borderRadius: '8px',
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>{table.table_number}</div>
            <div style={{ fontSize: `${10 * scale}px`, marginTop: '2px' }}>
              <Users size={10 * scale} style={{ display: 'inline', marginRight: '2px' }} />
              {table.capacity}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Tooltip con información de la mesa
  const renderTooltip = (table: Table) => {
    return (
      <Tooltip
        key={`tooltip-${table.id}`}
        placement="top"
        isOpen={hoveredTable?.id === table.id}
        target={`table-${table.id}`}
        toggle={() => {}}
      >
        <div>
          <strong>{table.table_number}</strong>
          <br />
          Capacidad: {table.capacity} personas
          <br />
          Estado: {getStatusText(table.status)}
          {table.zone && (
            <>
              <br />
              Zona: {table.zone.name}
            </>
          )}
        </div>
      </Tooltip>
    );
  };

  // Obtener texto de estado
  const getStatusText = (status: TableStatus): string => {
    const texts: Record<TableStatus, string> = {
      Available: 'Disponible',
      Reserved: 'Reservada',
      Occupied: 'Ocupada',
      Cleaning: 'En limpieza',
      Maintenance: 'Mantenimiento'
    };
    return texts[status];
  };

  if (tables.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardBody className="text-center py-5">
          <p className="text-muted">No hay mesas en esta zona</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {/* Leyenda de estados */}
      <Card className="shadow-sm mb-3">
        <CardBody>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#28a745',
                  borderRadius: '4px',
                }}
              />
              <span className="small">Disponible</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#17a2b8',
                  borderRadius: '4px',
                }}
              />
              <span className="small">Reservada</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ffc107',
                  borderRadius: '4px',
                }}
              />
              <span className="small">Ocupada</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#6c757d',
                  borderRadius: '4px',
                }}
              />
              <span className="small">Limpieza</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#dc3545',
                  borderRadius: '4px',
                }}
              />
              <span className="small">Mantenimiento</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Mapa de mesas */}
      <Card className="shadow-sm">
        <CardBody>
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: `${BASE_HEIGHT * scale}px`,
              backgroundColor: '#f8f9fa',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {tables.map(table => renderTable(table))}
            {tables.map(table => renderTooltip(table))}
          </div>

          {/* Información adicional */}
          <div className="mt-3 text-center">
            <small className="text-muted">
              Click en una mesa para ver más detalles
              {scale < 1 && ` • Escala: ${Math.round(scale * 100)}%`}
            </small>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TableLayoutMap;
