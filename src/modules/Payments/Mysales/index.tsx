import React, { useEffect, useState } from 'react';
import { Container, Modal, ModalHeader, ModalBody, Row, Col, Badge } from 'reactstrap';
import AzFilterSummary from '@/components/aziende/AzFilterSummary';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import { useMysales } from './hooks/useMysales';
import { useMysalesFetch } from './hooks/useMysalesFetch';
import { MysalesMockService } from './services/MysalesMockService';
import { mysalesColumns } from './config/tableMysalesColumns';
import { SaleTransactionModel, TransactionStatus } from './models/MysalesModel';

const mysalesService = new MysalesMockService();

const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date(dateString));
};

const getStatusConfig = (status: TransactionStatus): { color: string; label: string } => {
  const configs: Record<TransactionStatus, { color: string; label: string }> = {
    completed: { color: 'success', label: 'Completado' },
    pending: { color: 'warning', label: 'Pendiente' },
    failed: { color: 'danger', label: 'Fallido' },
    refunded: { color: 'info', label: 'Reembolsado' },
    cancelled: { color: 'secondary', label: 'Cancelado' }
  };
  return configs[status];
};

const Mysales: React.FC = () => {
  const { transactions, getKPIs } = useMysales();
  const { loading, fetchTransactions } = useMysalesFetch(mysalesService);
  const [selectedTransaction, setSelectedTransaction] = useState<SaleTransactionModel | null>(null);

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const kpis = getKPIs();

  return (
    <div className="page-content">
      <Container fluid>
        <Header
          kpis={kpis}
          loading={loading}
          onRefresh={() => fetchTransactions(1)}
        />

        <AzFilterSummary
          data={transactions}
          columns={mysalesColumns}
          alwaysVisible={true}
          showCount="always"
          countPosition="top"
        >
          {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
            <ContentTable
              filteredTransactions={filteredData}
              filters={filters}
              sorting={sorting}
              onFilterChange={onFilterChange}
              onSortChange={onSortChange}
              loading={loading}
              onViewDetails={(transaction) => setSelectedTransaction(transaction)}
            />
          )}
        </AzFilterSummary>

        <Modal
          isOpen={!!selectedTransaction}
          toggle={() => setSelectedTransaction(null)}
          size="lg"
        >
          <ModalHeader toggle={() => setSelectedTransaction(null)}>
            <i className="mdi mdi-receipt me-2"></i>
            Detalle de Transacción
          </ModalHeader>
          <ModalBody>
            {selectedTransaction && (
              <div>
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="border rounded p-3 h-100">
                      <h6 className="text-muted mb-3">
                        <i className="mdi mdi-information me-2"></i>
                        Información de la Transacción
                      </h6>
                      <p className="mb-2">
                        <strong>ID:</strong> {selectedTransaction.transactionId}
                      </p>
                      <p className="mb-2">
                        <strong>Referencia:</strong> {selectedTransaction.orderReference}
                      </p>
                      <p className="mb-2">
                        <strong>Fecha:</strong> {formatDate(selectedTransaction.createdAt)}
                      </p>
                      <p className="mb-0">
                        <strong>Estado:</strong>{' '}
                        <Badge color={getStatusConfig(selectedTransaction.status).color}>
                          {getStatusConfig(selectedTransaction.status).label}
                        </Badge>
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border rounded p-3 h-100">
                      <h6 className="text-muted mb-3">
                        <i className="mdi mdi-cash me-2"></i>
                        Detalles del Pago
                      </h6>
                      <p className="mb-2">
                        <strong>Monto Bruto:</strong>{' '}
                        <span className="text-dark fw-bold">
                          {formatCurrency(selectedTransaction.amounts.gross, selectedTransaction.amounts.currency)}
                        </span>
                      </p>
                      <p className="mb-2">
                        <strong>Comisión:</strong>{' '}
                        <span className="text-warning">
                          -{formatCurrency(selectedTransaction.amounts.commission, selectedTransaction.amounts.currency)}
                        </span>
                      </p>
                      <p className="mb-0">
                        <strong>Monto Neto:</strong>{' '}
                        <span className="text-success fw-bold">
                          {formatCurrency(selectedTransaction.amounts.net, selectedTransaction.amounts.currency)}
                        </span>
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <div className="border rounded p-3 h-100">
                      <h6 className="text-muted mb-3">
                        <i className="mdi mdi-account me-2"></i>
                        Cliente
                      </h6>
                      <p className="mb-2">
                        <strong>Nombre:</strong> {selectedTransaction.customer.name}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {selectedTransaction.customer.email}
                      </p>
                      {selectedTransaction.customer.phone && (
                        <p className="mb-0">
                          <strong>Teléfono:</strong> {selectedTransaction.customer.phone}
                        </p>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border rounded p-3 h-100">
                      <h6 className="text-muted mb-3">
                        <i className="mdi mdi-credit-card me-2"></i>
                        Método de Pago
                      </h6>
                      <p className="mb-2">
                        <strong>Método:</strong>{' '}
                        <i
                          className={`mdi ${selectedTransaction.paymentMethod.icon} me-1`}
                          style={{ color: selectedTransaction.paymentMethod.color }}
                        ></i>
                        {selectedTransaction.paymentMethod.name}
                      </p>
                      <p className="mb-0">
                        <strong>Cuenta:</strong> {selectedTransaction.paymentAccount.alias}
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="border rounded p-3">
                      <h6 className="text-muted mb-3">
                        <i className="mdi mdi-web me-2"></i>
                        Página de Origen
                      </h6>
                      <p className="mb-2">
                        <strong>Nombre:</strong> {selectedTransaction.page.name}
                      </p>
                      <p className="mb-2">
                        <strong>Dominio:</strong>{' '}
                        <a href={selectedTransaction.page.domain} target="_blank" rel="noopener noreferrer">
                          {selectedTransaction.page.domain}
                        </a>
                      </p>
                      {selectedTransaction.description && (
                        <p className="mb-0">
                          <strong>Descripción:</strong> {selectedTransaction.description}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </ModalBody>
        </Modal>
      </Container>
    </div>
  );
};

export default Mysales;
