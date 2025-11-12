import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Row,
  Col,
  Progress,
  Button
} from 'reactstrap';
import { MapPin, RefreshCw } from 'lucide-react';
import { Table, Zone, ZoneStats } from '../models/TableModel';
import { ReservationModel } from '../models/ReservationModel';
import TableLayoutMap from './TableLayoutMap';

interface TableManagementProps {
  tables: Table[];
  zones: Zone[];
  reservations: ReservationModel[];
  onTableClick?: (table: Table) => void;
  onRefresh?: () => void;
}

const TableManagement: React.FC<TableManagementProps> = ({
  tables,
  zones,
  reservations,
  onTableClick,
  onRefresh
}) => {
  const [selectedZone, setSelectedZone] = useState<number | null>(zones[0]?.id || null);
  const [zoneStats, setZoneStats] = useState<Map<number, ZoneStats>>(new Map());

  // Calcular estadísticas por zona
  useEffect(() => {
    const stats = new Map<number, ZoneStats>();

    zones.forEach(zone => {
      const zoneTables = tables.filter(t => t.zone_id === zone.id);
      const available = zoneTables.filter(t => t.status === 'Available').length;
      const occupied = zoneTables.filter(t => t.status === 'Occupied').length;
      const reserved = zoneTables.filter(t => t.status === 'Reserved').length;
      const totalCapacity = zoneTables.reduce((sum, t) => sum + t.capacity, 0);

      const currentDiners = reservations
        .filter(r =>
          r.zone_id === zone.id &&
          ['Confirmed', 'Seated'].includes(r.status)
        )
        .reduce((sum, r) => sum + r.diners, 0);

      stats.set(zone.id, {
        zone,
        total_tables: zoneTables.length,
        available_tables: available,
        occupied_tables: occupied,
        reserved_tables: reserved,
        total_capacity: totalCapacity,
        current_diners: currentDiners
      });
    });

    setZoneStats(stats);
  }, [tables, zones, reservations]);

  // Filtrar mesas por zona seleccionada
  const getFilteredTables = (): Table[] => {
    if (selectedZone === null) return [];
    return tables.filter(t => t.zone_id === selectedZone);
  };

  return (
    <div className="table-management">
      {/* Estadísticas generales */}
      <Row className="mb-4">
        {Array.from(zoneStats.values()).map(stat => (
          <Col key={stat.zone.id} xs={12} md={6} lg={3} className="mb-3">
            <Card
              className={`shadow-sm h-100 cursor-pointer ${selectedZone === stat.zone.id ? 'border-primary border-2' : ''}`}
              onClick={() => setSelectedZone(stat.zone.id)}
              style={{ cursor: 'pointer' }}
            >
              <CardBody>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">{stat.zone.name}</h6>
                  <MapPin size={18} style={{ color: stat.zone.color }} />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Ocupación</span>
                    <span>
                      {stat.total_tables - stat.available_tables}/{stat.total_tables}
                    </span>
                  </div>
                  <Progress
                    value={((stat.total_tables - stat.available_tables) / stat.total_tables) * 100}
                    color={
                      stat.available_tables / stat.total_tables > 0.5
                        ? 'success'
                        : stat.available_tables / stat.total_tables > 0.2
                        ? 'warning'
                        : 'danger'
                    }
                  />
                </div>

                <div className="d-flex justify-content-between small">
                  <div>
                    <Badge color="success">{stat.available_tables}</Badge>
                    <span className="ms-1 text-muted">Disponibles</span>
                  </div>
                  <div>
                    <Badge color="warning">{stat.occupied_tables}</Badge>
                    <span className="ms-1 text-muted">Ocupadas</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Encabezado con tabs de zonas */}
      <Card className="shadow-sm mb-3">
        <CardHeader className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Mapa de Mesas</h6>
            {onRefresh && (
              <Button color="primary" outline size="sm" onClick={onRefresh}>
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {/* Navegación por zonas */}
          <Nav tabs className="border-0">
            {zones.map(zone => {
              const zoneTables = tables.filter(t => t.zone_id === zone.id);
              return (
                <NavItem key={zone.id}>
                  <NavLink
                    active={selectedZone === zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={14} style={{ color: zone.color }} />
                      {zone.name}
                      <Badge color="secondary" pill>
                        {zoneTables.length}
                      </Badge>
                    </div>
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
        </CardBody>
      </Card>

      {/* Contenido del mapa por zona */}
      <TabContent activeTab={selectedZone?.toString() || ''}>
        {zones.map(zone => (
          <TabPane key={zone.id} tabId={zone.id.toString()}>
            {selectedZone === zone.id && (
              <TableLayoutMap
                tables={getFilteredTables()}
                onTableClick={onTableClick}
              />
            )}
          </TabPane>
        ))}
      </TabContent>

      <style>{`
        .cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TableManagement;
