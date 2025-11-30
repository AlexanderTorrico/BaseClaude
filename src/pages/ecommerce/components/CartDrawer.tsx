import React from 'react';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Badge,
  Input,
  InputGroup,
  InputGroupText,
} from 'reactstrap';
import { useCart } from '../hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  toggle: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, toggle }) => {
  const { cart, items, updateItemQuantity, removeItem, clearAllItems, getTotalItems } =
    useCart();

  return (
    <Offcanvas isOpen={isOpen} toggle={toggle} direction="end" style={{ width: '420px' }}>
      <OffcanvasHeader toggle={toggle} className="border-bottom">
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-cart font-size-20"></i>
          <span className="fw-bold">Carrito de Compras</span>
          {getTotalItems() > 0 && (
            <Badge color="primary" pill>
              {getTotalItems()}
            </Badge>
          )}
        </div>
      </OffcanvasHeader>

      <OffcanvasBody className="p-0">
        {items.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4">
            <i className="mdi mdi-cart-outline font-size-48 text-muted mb-3"></i>
            <h5 className="text-muted mb-2">Tu carrito está vacío</h5>
            <p className="text-muted text-center mb-3">
              Agrega productos para comenzar tu compra
            </p>
            <Button color="primary" onClick={toggle}>
              <i className="mdi mdi-shopping me-1"></i>
              Explorar productos
            </Button>
          </div>
        ) : (
          <>
            <div className="p-3" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-muted">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </small>
                <Button
                  color="link"
                  size="sm"
                  className="text-danger p-0"
                  onClick={clearAllItems}
                >
                  <i className="mdi mdi-trash-can me-1"></i>
                  Vaciar carrito
                </Button>
              </div>

              {items.map((item) => (
                <div key={item.product.id} className="border rounded p-2 mb-3">
                  <div className="d-flex gap-2">
                    <div
                      className="flex-shrink-0"
                      style={{
                        width: '80px',
                        height: '80px',
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

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0 font-size-13 fw-medium">
                          {item.product.name}
                        </h6>
                        <Button
                          color="link"
                          size="sm"
                          className="text-danger p-0 ms-2"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <i className="mdi mdi-close font-size-16"></i>
                        </Button>
                      </div>

                      <p className="text-muted mb-2 font-size-11">
                        {item.product.brand} • {item.product.condition === 'new' ? 'Nuevo' : 'Usado'}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <InputGroup size="sm" style={{ width: '110px' }}>
                            <Button
                              color="light"
                              size="sm"
                              onClick={() =>
                                updateItemQuantity(item.product.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <i className="mdi mdi-minus"></i>
                            </Button>
                            <InputGroupText className="bg-white border-start-0 border-end-0">
                              <span className="font-size-12 fw-medium">{item.quantity}</span>
                            </InputGroupText>
                            <Button
                              color="light"
                              size="sm"
                              onClick={() =>
                                updateItemQuantity(item.product.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= (item.product.availability.stock || 10)}
                            >
                              <i className="mdi mdi-plus"></i>
                            </Button>
                          </InputGroup>
                        </div>

                        <div className="text-end">
                          <div className="fw-bold text-primary">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </div>
                          {item.quantity > 1 && (
                            <small className="text-muted">
                              ${item.product.price.toLocaleString()} c/u
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top p-3 bg-light">
              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-medium">${cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">IVA (13%):</span>
                  <span className="fw-medium">${cart.tax.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Envío:</span>
                  <span className="fw-medium">
                    {cart.shipping === 0 ? (
                      <span className="text-success">Gratis</span>
                    ) : (
                      `$${cart.shipping.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>

              <div className="border-top pt-2 mb-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-bold font-size-16">Total:</span>
                  <span className="fw-bold text-primary font-size-18">
                    ${cart.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {cart.subtotal < 1000 && (
                <div className="alert alert-info py-2 px-3 mb-3 font-size-12">
                  <i className="mdi mdi-information me-1"></i>
                  Agrega ${(1000 - cart.subtotal).toLocaleString()} más para envío gratis
                </div>
              )}

              <Button color="primary" size="lg" block className="mb-2">
                <i className="mdi mdi-cart-check me-2"></i>
                Proceder al pago
              </Button>

              <Button color="light" size="sm" block onClick={toggle}>
                Continuar comprando
              </Button>
            </div>
          </>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default CartDrawer;
