import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Badge,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { OrderTrackingModel, OrderStatus } from '../models/CartModel';

interface OrderTrackingProps {
  isOpen: boolean;
  toggle: () => void;
  order: OrderTrackingModel | null;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ isOpen, toggle, order }) => {
  if (!order) return null;

  const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'success',
      in_transit: 'success',
      out_for_delivery: 'success',
      delivered: 'success',
      cancelled: 'danger',
    };
    return colors[status] || 'secondary';
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      processing: 'En proceso',
      shipped: 'Enviado',
      in_transit: 'En tránsito',
      out_for_delivery: 'En reparto',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: OrderStatus): string => {
    const icons: Record<OrderStatus, string> = {
      pending: 'mdi-clock-outline',
      confirmed: 'mdi-check-circle',
      processing: 'mdi-package-variant',
      shipped: 'mdi-truck',
      in_transit: 'mdi-truck-fast',
      out_for_delivery: 'mdi-bike-fast',
      delivered: 'mdi-home-check',
      cancelled: 'mdi-close-circle',
    };
    return icons[status] || 'mdi-information';
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-package-variant-closed font-size-20"></i>
          <span>Seguimiento de Pedido</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <Row className="mb-4">
          <Col xl={12}>
            <Card className="border-0 bg-light">
              <CardBody>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Número de pedido</small>
                      <h5 className="mb-0 fw-bold">{order.orderNumber}</h5>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Estado actual</small>
                      <Badge color={getStatusColor(order.status)} className="font-size-13">
                        <i className={`mdi ${getStatusIcon(order.status)} me-1`}></i>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">
                        Entrega estimada
                      </small>
                      <h6 className="mb-0">{order.estimatedDelivery}</h6>
                    </div>
                    {order.trackingNumber && (
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">
                          Número de rastreo
                        </small>
                        <code className="font-size-13">{order.trackingNumber}</code>
                      </div>
                    )}
                  </Col>
                </Row>

                {order.currentLocation && (
                  <div className="alert alert-info mb-0 py-2 px-3">
                    <i className="mdi mdi-map-marker me-1"></i>
                    <strong>Ubicación actual:</strong> {order.currentLocation}
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xl={12}>
            <h6 className="mb-3">
              <i className="mdi mdi-timeline-clock me-2"></i>
              Línea de tiempo
            </h6>

            <div className="timeline-wrapper">
              {order.timeline.map((event, index) => (
                <div
                  key={index}
                  className="timeline-item d-flex gap-3 position-relative"
                  style={{ paddingBottom: index < order.timeline.length - 1 ? '30px' : '0' }}
                >
                  <div
                    className={`timeline-icon rounded-circle d-flex align-items-center justify-content-center ${
                      event.completed ? 'bg-success' : 'bg-light border'
                    }`}
                    style={{
                      width: '40px',
                      height: '40px',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <i
                      className={`mdi ${getStatusIcon(event.status)} font-size-18 ${
                        event.completed ? 'text-white' : 'text-muted'
                      }`}
                    ></i>
                  </div>

                  {index < order.timeline.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '19px',
                        top: '40px',
                        bottom: '0',
                        width: '2px',
                        backgroundColor: event.completed ? '#28a745' : '#e9ecef',
                      }}
                    ></div>
                  )}

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6
                        className={`mb-0 font-size-14 ${
                          event.completed ? 'fw-bold' : 'text-muted'
                        }`}
                      >
                        {getStatusLabel(event.status)}
                      </h6>
                      <small className="text-muted">{event.date}</small>
                    </div>
                    <p className={`mb-0 font-size-13 ${event.completed ? '' : 'text-muted'}`}>
                      {event.description}
                    </p>
                    {event.location && (
                      <small className="text-muted">
                        <i className="mdi mdi-map-marker me-1"></i>
                        {event.location}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xl={12}>
            <h6 className="mb-3">
              <i className="mdi mdi-package-variant me-2"></i>
              Productos en este pedido
            </h6>

            {order.items.map((item) => (
              <div key={item.product.id} className="border rounded p-3 mb-2">
                <Row className="align-items-center">
                  <Col xs={2}>
                    <div
                      style={{
                        height: '60px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#f8f9fa',
                      }}
                    >
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </Col>
                  <Col xs={6}>
                    <h6 className="mb-0 font-size-13">{item.product.name}</h6>
                    <small className="text-muted">
                      Cantidad: {item.quantity}
                    </small>
                  </Col>
                  <Col xs={4} className="text-end">
                    <div className="fw-bold">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </Col>
                </Row>
              </div>
            ))}

            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between fw-bold">
                <span>Total del pedido:</span>
                <span className="text-primary font-size-18">
                  ${order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xl={12}>
            <h6 className="mb-3">
              <i className="mdi mdi-map-marker me-2"></i>
              Dirección de entrega
            </h6>

            <Card className="border">
              <CardBody>
                <h6 className="mb-2">{order.shippingAddress.fullName}</h6>
                <p className="text-muted mb-1 font-size-13">
                  {order.shippingAddress.address}
                </p>
                <p className="text-muted mb-1 font-size-13">
                  {order.shippingAddress.city}, {order.shippingAddress.region}
                </p>
                <p className="text-muted mb-1 font-size-13">
                  {order.shippingAddress.country} - {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted mb-0 font-size-13">
                  <i className="mdi mdi-phone me-1"></i>
                  {order.shippingAddress.phone}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {order.status === 'delivered' && (
          <Row className="mt-4">
            <Col xl={12}>
              <div className="alert alert-success d-flex justify-content-between align-items-center">
                <div>
                  <i className="mdi mdi-check-circle me-2"></i>
                  <strong>¡Pedido entregado con éxito!</strong>
                  <br />
                  <small>¿Qué te pareció tu compra?</small>
                </div>
                <Button color="success" size="sm">
                  <i className="mdi mdi-star me-1"></i>
                  Calificar producto
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </ModalBody>
    </Modal>
  );
};

export default OrderTracking;
