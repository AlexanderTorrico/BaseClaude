import React, { useEffect, useCallback } from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink, Alert } from 'reactstrap';
import { useUserCompanyId } from '@/core/auth/hooks/useUserCompanyId';
import { usePaymentTest } from './hooks/usePaymentTest';
import { usePaymentTestFetch } from './hooks/usePaymentTestFetch';

// Components
import TestPaymentForm from './components/TestPaymentForm';
import PaymentStatusCard from './components/PaymentStatusCard';
import TransactionHistory from './components/TransactionHistory';
import StatsCards from './components/StatsCards';

const PaymentTest: React.FC = () => {
  const companyId = useUserCompanyId();
  const {
    currentTransaction,
    transactions,
    stats,
    currentView,
    setCurrentView,
    clearCurrentTransaction,
    hasConfigs,
  } = usePaymentTest();

  const {
    loading,
    error,
    fetchAll,
    fetchTransactions,
    createOrder,
    captureOrder,
    checkOrderStatus,
    clearError,
  } = usePaymentTestFetch(companyId || 0);

  // Limpiar transacción actual al montar el componente
  useEffect(() => {
    clearCurrentTransaction();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (companyId) {
      fetchAll();
    }
  }, [companyId, fetchAll]);

  // Handler para crear orden
  const handleCreateOrder = useCallback(async (amount: number, currency: string, description?: string) => {
    const result = await createOrder(amount, currency, description);
    if (result?.approve_url) {
      // Abrir PayPal en nueva ventana
      window.open(result.approve_url, '_blank', 'width=500,height=700');
    }
  }, [createOrder]);

  // Handler para capturar pago
  const handleCapture = useCallback(async () => {
    if (currentTransaction?.paypalOrderId) {
      await captureOrder(currentTransaction.paypalOrderId);
    }
  }, [currentTransaction, captureOrder]);

  // Handler para verificar estado
  const handleCheckStatus = useCallback(async () => {
    if (currentTransaction?.paypalOrderId) {
      await checkOrderStatus(currentTransaction.paypalOrderId);
    }
  }, [currentTransaction, checkOrderStatus]);

  // Handler para abrir PayPal
  const handleOpenPayPal = useCallback(() => {
    if (currentTransaction?.approveUrl) {
      window.open(currentTransaction.approveUrl, '_blank', 'width=500,height=700');
    }
  }, [currentTransaction]);

  // Handler para nuevo pago
  const handleNewPayment = useCallback(() => {
    clearCurrentTransaction();
  }, [clearCurrentTransaction]);

  // Handler para refresh de historial
  const handleRefreshHistory = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (!companyId) {
    return (
      <Container className="py-4">
        <Alert color="warning">
          <i className="mdi mdi-alert me-2" />
          No se pudo obtener el ID de la empresa. Por favor, inicia sesión nuevamente.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="mb-4">
        <h4 className="mb-1">
          <i className="mdi mdi-credit-card-check me-2" />
          Pruebas de Pago PayPal
        </h4>
        <p className="text-muted mb-0">
          Realiza pagos de prueba para verificar la integración con PayPal
        </p>
      </div>

      {/* Tabs de navegación */}
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={currentView === 'form' ? 'active' : ''}
            onClick={() => setCurrentView('form')}
            style={{ cursor: 'pointer' }}
          >
            <i className="mdi mdi-plus-circle me-2" />
            Nuevo Pago
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={currentView === 'history' ? 'active' : ''}
            onClick={() => setCurrentView('history')}
            style={{ cursor: 'pointer' }}
          >
            <i className="mdi mdi-history me-2" />
            Historial ({transactions.length})
          </NavLink>
        </NavItem>
      </Nav>

      {/* Vista de Nuevo Pago */}
      {currentView === 'form' && (
        <Row>
          <Col lg={6}>
            {!currentTransaction ? (
              <TestPaymentForm
                loading={loading}
                error={error}
                onCreateOrder={handleCreateOrder}
                onClearError={clearError}
              />
            ) : (
              <PaymentStatusCard
                transaction={currentTransaction}
                loading={loading}
                onCapture={handleCapture}
                onCheckStatus={handleCheckStatus}
                onNewPayment={handleNewPayment}
                onOpenPayPal={handleOpenPayPal}
              />
            )}
          </Col>

          <Col lg={6}>
            {/* Instrucciones */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <i className="mdi mdi-information-outline me-2 text-info" />
                  Instrucciones
                </h5>

                <div className="mb-4">
                  <h6>Flujo de prueba:</h6>
                  <ol className="mb-0">
                    <li className="mb-2">
                      <strong>Crear orden:</strong> Ingresa un monto y crea la orden de pago
                    </li>
                    <li className="mb-2">
                      <strong>Aprobar en PayPal:</strong> Se abrirá una ventana de PayPal Sandbox
                    </li>
                    <li className="mb-2">
                      <strong>Capturar pago:</strong> Una vez aprobado, captura el pago para completarlo
                    </li>
                  </ol>
                </div>

                <div className="mb-4">
                  <h6>Cuenta de prueba PayPal Sandbox:</h6>
                  <div className="bg-light rounded p-3">
                    <p className="mb-1">
                      <strong>Email:</strong> <code>sb-buyer@personal.example.com</code>
                    </p>
                    <p className="mb-0">
                      <strong>Password:</strong> <code>12345678</code>
                    </p>
                  </div>
                  <small className="text-muted">
                    * Usa estas credenciales en la ventana de PayPal para aprobar el pago
                  </small>
                </div>

                <div className="alert alert-warning mb-0">
                  <i className="mdi mdi-alert me-2" />
                  <strong>Nota:</strong> Asegúrate de que tu configuración de PayPal esté en modo
                  <strong> Sandbox</strong> para realizar pruebas.
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Vista de Historial */}
      {currentView === 'history' && (
        <>
          <StatsCards stats={stats} />
          <TransactionHistory
            transactions={transactions}
            loading={loading}
            onRefresh={handleRefreshHistory}
          />
        </>
      )}
    </Container>
  );
};

export default PaymentTest;
