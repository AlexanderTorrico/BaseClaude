import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useOrders } from './hooks/useOrders';
import { useOrdersFetch } from './hooks/useOrdersFetch';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import { orderTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import ContentCards from './components/ContentCards';
import { OrderMockService } from './services/OrderMockService';
import { printReceipt } from './utils/printReceipt';

const orderService = new OrderMockService();

const Orders: React.FC = () => {
  const { currentView, getOrdersForActiveTab } = useOrders();
  const { loading, fetchOrders, advanceOrderStatus, cancelOrder } = useOrdersFetch(orderService);

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrdersByTab = getOrdersForActiveTab();

  return (
    <div className="page-content" style={{ overflowX: 'clip' }}>
      <Container fluid style={{ overflowX: 'clip' }}>
        <Header loading={loading} onRefresh={fetchOrders} />

        <AzFilterSummary
          data={filteredOrdersByTab}
          columns={orderTableColumns}
          alwaysVisible={false}
          showCount="auto"
          countPosition="top"
        >
          {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
            <>
              {currentView === '0' && (
                <Row>
                  <Col xl={12}>
                    <ContentTable
                      filteredOrders={filteredData}
                      filters={filters}
                      sorting={sorting}
                      onFilterChange={onFilterChange}
                      onSortChange={onSortChange}
                      loading={loading}
                      onAdvanceStatus={advanceOrderStatus}
                      onCancelOrder={cancelOrder}
                      onPrintReceipt={printReceipt}
                    />
                  </Col>
                </Row>
              )}

              {currentView === '1' && (
                <ContentCards
                  filteredOrders={filteredData}
                  loading={loading}
                  onAdvanceStatus={advanceOrderStatus}
                  onCancelOrder={cancelOrder}
                  onPrintReceipt={printReceipt}
                />
              )}
            </>
          )}
        </AzFilterSummary>
      </Container>
    </div>
  );
};

export default Orders;
