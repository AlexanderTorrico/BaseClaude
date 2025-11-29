import React from 'react';
import { Nav, NavItem, NavLink, Badge } from 'reactstrap';
import { OrderStatus, ORDER_STATUS_CONFIG } from '../models/OrderModel';

interface StatusTabsProps {
  activeTab: OrderStatus;
  onTabChange: (status: OrderStatus) => void;
  counts: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  urgentCount: number;
}

const TAB_ORDER: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED
];

const StatusTabs: React.FC<StatusTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  urgentCount
}) => {
  const getCountForStatus = (status: OrderStatus): number => {
    switch (status) {
      case OrderStatus.PENDING: return counts.pending;
      case OrderStatus.CONFIRMED: return counts.confirmed;
      case OrderStatus.SHIPPED: return counts.shipped;
      case OrderStatus.DELIVERED: return counts.delivered;
      case OrderStatus.CANCELLED: return counts.cancelled;
      default: return 0;
    }
  };

  return (
    <Nav tabs className="nav-tabs-custom mb-4">
      {TAB_ORDER.map((status) => {
        const config = ORDER_STATUS_CONFIG[status];
        const count = getCountForStatus(status);
        const isActive = activeTab === status;
        const showUrgent = status === OrderStatus.PENDING && urgentCount > 0;

        return (
          <NavItem key={status}>
            <NavLink
              className={`${isActive ? 'active' : ''} d-flex align-items-center gap-2 px-4 py-3`}
              onClick={() => onTabChange(status)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`mdi ${config.icon} font-size-16 text-${isActive ? config.color : 'muted'}`}></i>
              <span className={isActive ? 'fw-medium' : ''}>{config.label}</span>
              <Badge
                color={isActive ? config.color : 'light'}
                className={!isActive ? 'text-muted' : ''}
                pill
              >
                {count}
              </Badge>
              {showUrgent && (
                <Badge
                  color="danger"
                  pill
                  className="ms-1"
                  title={`${urgentCount} pedido(s) urgente(s) - más de 2 horas sin confirmar`}
                >
                  <i className="mdi mdi-alert font-size-10"></i>
                </Badge>
              )}
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default StatusTabs;
