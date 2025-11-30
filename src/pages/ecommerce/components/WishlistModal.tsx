import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap';
import { useCart } from '../hooks/useCart';

interface WishlistModalProps {
  isOpen: boolean;
  toggle: () => void;
  onViewProduct: (productId: number) => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, toggle, onViewProduct }) => {
  const { wishlist, removeFromWishlist, moveToCart } = useCart();

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-heart font-size-20 text-danger"></i>
          <span>Mi Lista de Deseos</span>
        </div>
      </ModalHeader>
      <ModalBody>
        {wishlist.length === 0 ? (
          <div className="text-center py-5">
            <i className="mdi mdi-heart-outline font-size-48 text-muted mb-3"></i>
            <h5 className="text-muted mb-2">Tu lista de deseos está vacía</h5>
            <p className="text-muted mb-3">
              Guarda tus productos favoritos para comprarlos después
            </p>
            <Button color="primary" onClick={toggle}>
              <i className="mdi mdi-shopping me-1"></i>
              Explorar productos
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <small className="text-muted">
                {wishlist.length} {wishlist.length === 1 ? 'producto' : 'productos'} guardados
              </small>
            </div>

            <Row className="g-3">
              {wishlist.map((item) => (
                <Col key={item.product.id} xs={12} md={6} lg={4}>
                  <Card className="border h-100">
                    <div
                      className="position-relative"
                      style={{
                        height: '180px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        onViewProduct(item.product.id);
                        toggle();
                      }}
                    >
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      <Button
                        color="light"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 rounded-circle"
                        style={{ width: '32px', height: '32px', padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item.product.id);
                        }}
                      >
                        <i className="mdi mdi-close text-danger"></i>
                      </Button>
                    </div>

                    <CardBody className="p-3">
                      <h6
                        className="mb-2 font-size-13 fw-medium"
                        style={{ cursor: 'pointer', minHeight: '35px' }}
                        onClick={() => {
                          onViewProduct(item.product.id);
                          toggle();
                        }}
                      >
                        {item.product.name}
                      </h6>

                      <p className="text-muted mb-2 font-size-12">
                        {item.product.brand} • {item.product.year}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <div className="fw-bold text-primary">
                            ${item.product.price.toLocaleString()}
                          </div>
                          {item.product.rating && (
                            <div className="font-size-12">
                              <i className="mdi mdi-star text-warning"></i>
                              <span className="ms-1">{item.product.rating}</span>
                            </div>
                          )}
                        </div>

                        {item.product.status === 'in_stock' && (
                          <small className="text-success">
                            <i className="mdi mdi-check-circle me-1"></i>
                            En stock
                          </small>
                        )}
                      </div>

                      <Button
                        color="primary"
                        size="sm"
                        block
                        onClick={() => {
                          moveToCart(item.product.id);
                        }}
                      >
                        <i className="mdi mdi-cart-plus me-1"></i>
                        Agregar al carrito
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default WishlistModal;
