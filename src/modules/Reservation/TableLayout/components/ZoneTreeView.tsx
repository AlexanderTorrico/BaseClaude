import React from 'react';
import { Card, CardBody, Badge, Button, Collapse } from 'reactstrap';
import { ZoneModel, TableModel } from '../models/TableLayoutModel';

interface ZoneTreeViewProps {
  zones: ZoneModel[];
  selectedZoneId: number | null;
  selectedTableId: number | null;
  expandedZones: number[];
  onSelectTable: (tableId: number) => void;
  onToggleZone: (zoneId: number) => void;
  totalZones: number;
  totalTables: number;
}

const ZoneTreeView: React.FC<ZoneTreeViewProps> = ({
  zones,
  selectedZoneId,
  selectedTableId,
  expandedZones,
  onSelectTable,
  onToggleZone,
  totalZones,
  totalTables,
}) => {

  const toggleZone = (zoneId: number) => {
    onToggleZone(zoneId);
  };

  const getShapeIcon = (shape: string): string => {
    switch (shape) {
      case 'circle':
        return 'mdi-circle-outline';
      case 'rectangle':
        return 'mdi-rectangle-outline';
      case 'square':
      default:
        return 'mdi-square-outline';
    }
  };

  const getShapeColor = (shape: string): string => {
    switch (shape) {
      case 'circle':
        return '#10b981';
      case 'rectangle':
        return '#f59e0b';
      case 'square':
      default:
        return '#3b82f6';
    }
  };

  return (
    <Card className="h-100">
      <CardBody>
        <h5 className="mb-3">
          <i className="mdi mdi-file-tree me-2 text-primary"></i>
          Estructura de Zonas y Mesas
        </h5>

        <div className="d-flex gap-2 mb-3">
          <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded bg-light flex-fill">
            <i className="mdi mdi-map-marker text-primary font-size-18"></i>
            <div>
              <div className="fw-medium">{totalZones}</div>
              <div className="text-muted font-size-12">Zonas</div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded bg-light flex-fill">
            <i className="mdi mdi-table-furniture text-success font-size-18"></i>
            <div>
              <div className="fw-medium">{totalTables}</div>
              <div className="text-muted font-size-12">Mesas</div>
            </div>
          </div>
        </div>

        <div className="tree-view">
          {zones.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="mdi mdi-map-marker-off-outline font-size-24 d-block mb-2"></i>
              No hay zonas creadas
            </div>
          ) : (
            zones.map(zone => (
              <div key={zone.id} className="mb-2">
                <div
                  className={`d-flex align-items-center p-2 border rounded cursor-pointer ${
                    selectedZoneId === zone.id ? 'bg-primary-subtle border-primary' : 'bg-light'
                  }`}
                  onClick={() => toggleZone(zone.id)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <i
                    className={`mdi ${
                      expandedZones.includes(zone.id) ? 'mdi-chevron-down' : 'mdi-chevron-right'
                    } me-2`}
                    style={{
                      transition: 'transform 0.2s ease-in-out',
                      display: 'inline-block'
                    }}
                  ></i>
                  <i className="mdi mdi-map-marker text-primary me-2"></i>
                  <span className="fw-medium flex-grow-1">{zone.name}</span>
                  <Badge color="primary" pill>
                    {zone.booTables.length}
                  </Badge>
                </div>

                <Collapse isOpen={expandedZones.includes(zone.id)}>
                  <div className="ms-4 mt-1">
                    {zone.booTables.length === 0 ? (
                      <div className="text-muted font-size-12 py-2 ps-3">Sin mesas</div>
                    ) : (
                      zone.booTables.map(table => (
                        <div
                          key={table.id}
                          className={`d-flex align-items-center p-2 mb-1 border rounded cursor-pointer ${
                            selectedTableId === table.id ? 'bg-success-subtle border-success' : 'bg-white'
                          }`}
                          onClick={() => onSelectTable(table.id)}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out'
                          }}
                        >
                          <i className={`mdi ${getShapeIcon(table.shape)} me-2`} style={{ color: getShapeColor(table.shape) }}></i>
                          <span className="flex-grow-1">{table.number}</span>
                          <Badge color="light" className="text-muted">
                            <i className="mdi mdi-account-multiple me-1"></i>
                            {table.capacity}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </Collapse>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ZoneTreeView;
