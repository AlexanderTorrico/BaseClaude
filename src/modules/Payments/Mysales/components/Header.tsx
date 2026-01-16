import React from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { SalesKPIs } from '../models/MysalesModel';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card className="border-0 shadow-sm h-100">
    <CardBody className="p-3">
      <div className="d-flex align-items-center">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{
            width: 48,
            height: 48,
            backgroundColor: `${color}15`
          }}
        >
          <i className={`mdi ${icon} font-size-24`} style={{ color }}></i>
        </div>
        <div className="flex-grow-1">
          <p className="text-muted mb-1 font-size-13">{title}</p>
          <h4 className="mb-0 fw-bold">{value}</h4>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
      </div>
    </CardBody>
  </Card>
);

interface HeaderProps {
  kpis: SalesKPIs;
  loading: boolean;
  onRefresh: () => void;
}

const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

const Header: React.FC<HeaderProps> = ({ kpis, loading, onRefresh }) => {
  return (
    <>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Mis Ventas</h4>
              <p className="text-muted mb-0">
                Historial de transacciones y pagos recibidos
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button
                color="light"
                onClick={onRefresh}
                disabled={loading}
                className="d-flex align-items-center"
              >
                <i className={`mdi mdi-refresh me-1 ${loading ? 'mdi-spin' : ''}`}></i>
                Actualizar
              </Button>
              <Button color="success" className="d-flex align-items-center">
                <i className="mdi mdi-download me-1"></i>
                Exportar
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} sm={6} lg={3} className="mb-3 mb-lg-0">
          <KPICard
            title="Total Bruto"
            value={formatCurrency(kpis.totalGross, kpis.currency)}
            icon="mdi-cash-multiple"
            color="#28a745"
            subtitle={`${kpis.completedCount} transacciones completadas`}
          />
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3 mb-lg-0">
          <KPICard
            title="Total Neto"
            value={formatCurrency(kpis.totalNet, kpis.currency)}
            icon="mdi-wallet"
            color="#007bff"
            subtitle="Después de comisiones"
          />
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3 mb-lg-0">
          <KPICard
            title="Comisiones"
            value={formatCurrency(kpis.totalCommissions, kpis.currency)}
            icon="mdi-percent"
            color="#fd7e14"
            subtitle="Total deducido"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <KPICard
            title="Transacciones"
            value={kpis.transactionCount}
            icon="mdi-receipt"
            color="#6f42c1"
            subtitle={`${kpis.pendingCount} pendientes · ${kpis.failedCount} fallidas`}
          />
        </Col>
      </Row>
    </>
  );
};

export default Header;
