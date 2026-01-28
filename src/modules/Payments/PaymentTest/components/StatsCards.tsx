import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { TransactionStats } from '../models/PaymentTestModel';

interface StatsCardsProps {
  stats: TransactionStats | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Transacciones',
      value: stats.summary.total_transactions,
      icon: 'mdi-receipt',
      color: 'primary',
    },
    {
      title: 'Exitosas',
      value: stats.summary.successful_transactions,
      icon: 'mdi-check-circle',
      color: 'success',
    },
    {
      title: 'Tasa de Éxito',
      value: `${stats.summary.success_rate.toFixed(1)}%`,
      icon: 'mdi-percent',
      color: 'info',
    },
    {
      title: 'Total Capturado',
      value: formatCurrency(stats.summary.total_captured),
      icon: 'mdi-cash-multiple',
      color: 'warning',
    },
  ];

  return (
    <Row className="mb-4">
      {cards.map((card, index) => (
        <Col md={3} key={index}>
          <Card className="mini-stat bg-white">
            <CardBody>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <p className="text-muted fw-medium mb-2">{card.title}</p>
                  <h4 className="mb-0">{card.value}</h4>
                </div>
                <div className={`mini-stat-icon avatar-sm align-self-center rounded-circle bg-${card.color}`}>
                  <span className="avatar-title">
                    <i className={`mdi ${card.icon} text-white font-size-24`} />
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
