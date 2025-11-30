import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import AzHeaderCardViews from '../../../../components/aziende/AzHeader/AzHeaderCardViews';
import StatusTabs from './StatusTabs';
import { useOrders } from '../hooks/useOrders';
import { setCurrentView, setActiveTab } from '../slices/orderSlice';
import { OrderStatus } from '../models/OrderModel';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ loading, onRefresh }) => {
  const dispatch = useDispatch();
  const { getTotalOrders, getStatusSummary, getUrgentOrdersCount, currentView, activeTab } = useOrders();

  const [responsiveView, setResponsiveView] = useState<string>('1');
  const [isManualOverride, setIsManualOverride] = useState(false);

  const statusSummary = getStatusSummary();
  const urgentCount = getUrgentOrdersCount();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const autoView = isMobile ? '1' : '1';

      setResponsiveView(autoView);

      if (!isManualOverride) {
        dispatch(setCurrentView(autoView));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, isManualOverride]);

  const handleRefresh = async () => {
    await onRefresh();
  };

  const handleViewChange = (viewKey: string) => {
    dispatch(setCurrentView(viewKey));
    setIsManualOverride(true);
  };

  const handleTabChange = (status: OrderStatus) => {
    dispatch(setActiveTab(status));
  };

  return (
    <>
      <AzHeaderCardViews
        title="Gestión de Pedidos"
        description="Administra los pedidos de tu página web"
        badge={{
          count: getTotalOrders(),
          total: getTotalOrders(),
          color: 'primary'
        }}
        currentView={currentView}
        onViewChange={handleViewChange}
        views={[
          { key: '0', name: 'Tabla', icon: 'mdi-table', title: 'Vista Tabla' },
          { key: '1', name: 'Cards', icon: 'mdi-card-multiple', title: 'Vista Cards' }
        ]}
        contentTopRight={
          <div className="d-flex gap-2">
            <Button
              color="light"
              onClick={handleRefresh}
              className="d-flex align-items-center"
              disabled={loading}
              title="Actualizar datos"
            >
              <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''} me-1`}></i>
              Actualizar
            </Button>
          </div>
        }
        responsiveMode={!isManualOverride}
        responsiveView={responsiveView}
        isManualOverride={isManualOverride}
      />

      <StatusTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={statusSummary}
        urgentCount={urgentCount}
      />
    </>
  );
};

export default Header;
