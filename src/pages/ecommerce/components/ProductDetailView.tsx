import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
} from 'reactstrap';
import { ProductModel } from '../models/ProductModel';

interface ProductDetailViewProps {
  product: ProductModel;
  relatedProducts: ProductModel[];
  onBack: () => void;
  onViewRelated: (product: ProductModel) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  onBack,
  onViewRelated,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImage, setSelectedImage] = useState(product.mainImage);

  const getConditionBadge = () => {
    const colors = {
      new: 'success',
      used: 'warning',
      refurbished: 'info',
    };
    const labels = {
      new: 'Nuevo',
      used: 'Usado',
      refurbished: 'Reacondicionado',
    };
    return (
      <Badge color={colors[product.condition]} className="me-2">
        {labels[product.condition]}
      </Badge>
    );
  };

  const getStatusBadge = () => {
    if (product.status === 'in_stock') {
      return (
        <Badge color="success">
          <i className="mdi mdi-check-circle me-1"></i>
          En stock ({product.availability.stock} disponibles)
        </Badge>
      );
    }
    if (product.status === 'immediate_shipping') {
      return (
        <Badge color="primary">
          <i className="mdi mdi-rocket me-1"></i>
          Envío inmediato
        </Badge>
      );
    }
    if (product.status === 'reservation') {
      return (
        <Badge color="warning">
          <i className="mdi mdi-calendar-clock me-1"></i>
          Disponible por reserva
        </Badge>
      );
    }
    return <Badge color="secondary">Agotado</Badge>;
  };

  return (
    <>
      <Row className="mb-3">
        <Col xl={12}>
          <Button color="light" size="sm" onClick={onBack}>
            <i className="mdi mdi-arrow-left me-1"></i>
            Volver a productos
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xl={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div
                className="product-main-image mb-3"
                style={{
                  height: '400px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {product.images.length > 1 && (
                <Row className="g-2">
                  {product.images.map((image, idx) => (
                    <Col key={idx} xs={3}>
                      <div
                        className={`product-thumbnail ${
                          selectedImage === image ? 'border-primary' : ''
                        }`}
                        style={{
                          height: '80px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border:
                            selectedImage === image
                              ? '2px solid var(--bs-primary)'
                              : '1px solid #dee2e6',
                        }}
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image}
                          alt={`${product.name} - ${idx + 1}`}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col xl={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              <div className="mb-3">
                {getConditionBadge()}
                {product.tags.map((tag, idx) => (
                  <Badge key={idx} color="light" className="me-2">
                    <i className="mdi mdi-check me-1"></i>
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="mb-2">{product.name}</h3>

              <p className="text-muted mb-3">
                <span className="fw-medium">{product.brand}</span> • {product.model} •{' '}
                {product.year}
              </p>

              <div className="d-flex align-items-center gap-3 mb-4">
                {product.rating && (
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-star text-warning font-size-18 me-1"></i>
                    <span className="fw-medium font-size-16">{product.rating}</span>
                    {product.reviews && (
                      <span className="text-muted ms-2">
                        ({product.reviews} valoraciones)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="border-top border-bottom py-3 mb-4">
                <div className="d-flex align-items-baseline justify-content-between mb-2">
                  <h2 className="mb-0 text-primary fw-bold">
                    ${product.price.toLocaleString()} {product.currency}
                  </h2>
                  <p className="text-muted mb-0">
                    {product.vatIncluded ? 'IVA incluido' : 'IVA no incluido'}
                  </p>
                </div>
                {!product.vatIncluded && (
                  <p className="text-muted mb-0 font-size-13">
                    ${product.priceWithVAT.toLocaleString()} {product.currency} con IVA
                  </p>
                )}
              </div>

              <div className="mb-4">{getStatusBadge()}</div>

              <div className="mb-4">
                <h6 className="mb-3">
                  <i className="mdi mdi-star-circle text-warning me-2"></i>
                  Características destacadas
                </h6>
                <Row>
                  {product.highlights.map((highlight, idx) => (
                    <Col key={idx} xs={12} md={6} className="mb-2">
                      <div className="d-flex align-items-start">
                        <i className="mdi mdi-check-circle text-success font-size-16 me-2 mt-1"></i>
                        <span>{highlight}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              <div className="mb-4">
                <h6 className="mb-2">
                  <i className="mdi mdi-truck-fast me-2"></i>
                  Disponibilidad y Logística
                </h6>
                <div className="bg-light p-3 rounded">
                  <div className="mb-2">
                    <i className="mdi mdi-clock-outline me-2 text-primary"></i>
                    <span className="fw-medium">Tiempo de entrega:</span>{' '}
                    {product.availability.deliveryTime}
                  </div>
                  {product.availability.pickupLocation && (
                    <div className="mb-2">
                      <i className="mdi mdi-map-marker me-2 text-primary"></i>
                      <span className="fw-medium">Ubicación:</span>{' '}
                      {product.availability.pickupLocation}
                    </div>
                  )}
                  {product.availability.returnPolicy && (
                    <div>
                      <i className="mdi mdi-arrow-u-left-top me-2 text-primary"></i>
                      <span className="fw-medium">Devoluciones:</span>{' '}
                      {product.availability.returnPolicy}
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button color="primary" size="lg" block>
                  <i className="mdi mdi-cart-plus me-2"></i>
                  Añadir al carrito
                </Button>
                <Button color="success" size="lg" block>
                  <i className="mdi mdi-lightning-bolt me-2"></i>
                  Comprar ahora
                </Button>
              </div>

              {product.status === 'reservation' && (
                <Button color="warning" size="lg" block className="mt-2">
                  <i className="mdi mdi-calendar-check me-2"></i>
                  Reservar producto
                </Button>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xl={12}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTab === 'details' ? 'active' : ''}
                    onClick={() => setActiveTab('details')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="mdi mdi-information me-1"></i>
                    Descripción
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === 'specs' ? 'active' : ''}
                    onClick={() => setActiveTab('specs')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="mdi mdi-cog me-1"></i>
                    Especificaciones técnicas
                  </NavLink>
                </NavItem>
                {product.usage && (
                  <NavItem>
                    <NavLink
                      className={activeTab === 'usage' ? 'active' : ''}
                      onClick={() => setActiveTab('usage')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="mdi mdi-speedometer me-1"></i>
                      Uso y estado
                    </NavLink>
                  </NavItem>
                )}
              </Nav>

              <TabContent activeTab={activeTab} className="pt-4">
                <TabPane tabId="details">
                  <h5 className="mb-3">Descripción del producto</h5>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    {product.description}
                  </p>
                </TabPane>

                <TabPane tabId="specs">
                  <h5 className="mb-3">Especificaciones técnicas</h5>

                  {product.specifications.dimensions && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-2">Dimensiones y Peso</h6>
                      <Table bordered size="sm" className="mb-0">
                        <tbody>
                          {product.specifications.dimensions.length && (
                            <tr>
                              <td className="fw-medium" width="30%">
                                Largo
                              </td>
                              <td>
                                {product.specifications.dimensions.length}{' '}
                                {product.specifications.dimensions.unit?.split('/')[0]}
                              </td>
                            </tr>
                          )}
                          {product.specifications.dimensions.width && (
                            <tr>
                              <td className="fw-medium">Ancho</td>
                              <td>
                                {product.specifications.dimensions.width}{' '}
                                {product.specifications.dimensions.unit?.split('/')[0]}
                              </td>
                            </tr>
                          )}
                          {product.specifications.dimensions.height && (
                            <tr>
                              <td className="fw-medium">Alto</td>
                              <td>
                                {product.specifications.dimensions.height}{' '}
                                {product.specifications.dimensions.unit?.split('/')[0]}
                              </td>
                            </tr>
                          )}
                          {product.specifications.dimensions.weight && (
                            <tr>
                              <td className="fw-medium">Peso</td>
                              <td>
                                {product.specifications.dimensions.weight}{' '}
                                {product.specifications.dimensions.unit?.split('/')[1]}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {product.specifications.performance && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-2">Rendimiento</h6>
                      <Table bordered size="sm" className="mb-0">
                        <tbody>
                          {Object.entries(product.specifications.performance).map(
                            ([key, value]) => (
                              <tr key={key}>
                                <td className="fw-medium" width="30%">
                                  {key === 'power'
                                    ? 'Potencia'
                                    : key === 'autonomy'
                                    ? 'Autonomía'
                                    : 'Eficiencia'}
                                </td>
                                <td>{value}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {product.specifications.technical && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-2">Detalles técnicos</h6>
                      <Table bordered size="sm" className="mb-0">
                        <tbody>
                          {Object.entries(product.specifications.technical).map(
                            ([key, value]) => (
                              <tr key={key}>
                                <td className="fw-medium" width="30%">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </td>
                                <td>{value}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {product.specifications.certifications && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-2">Certificaciones</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {product.specifications.certifications.map((cert, idx) => (
                          <Badge key={idx} color="info" className="p-2">
                            <i className="mdi mdi-certificate me-1"></i>
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.specifications.warranty && (
                    <div className="bg-light p-3 rounded">
                      <i className="mdi mdi-shield-check text-success me-2"></i>
                      <span className="fw-medium">Garantía:</span>{' '}
                      {product.specifications.warranty}
                    </div>
                  )}
                </TabPane>

                {product.usage && (
                  <TabPane tabId="usage">
                    <h5 className="mb-3">Uso y estado del producto</h5>

                    <Row>
                      {product.usage.kilometers !== undefined && (
                        <Col md={6} className="mb-3">
                          <Card className="bg-light border-0">
                            <CardBody className="text-center">
                              <i className="mdi mdi-speedometer font-size-36 text-primary mb-2"></i>
                              <h4 className="mb-1">
                                {product.usage.kilometers.toLocaleString()}
                              </h4>
                              <p className="text-muted mb-0">Kilómetros recorridos</p>
                            </CardBody>
                          </Card>
                        </Col>
                      )}

                      {product.usage.hours !== undefined && (
                        <Col md={6} className="mb-3">
                          <Card className="bg-light border-0">
                            <CardBody className="text-center">
                              <i className="mdi mdi-clock-outline font-size-36 text-primary mb-2"></i>
                              <h4 className="mb-1">
                                {product.usage.hours.toLocaleString()}
                              </h4>
                              <p className="text-muted mb-0">Horas de uso</p>
                            </CardBody>
                          </Card>
                        </Col>
                      )}
                    </Row>

                    {product.usage.condition && (
                      <div className="bg-light p-3 rounded">
                        <h6 className="mb-2">Estado general</h6>
                        <p className="mb-0">{product.usage.condition}</p>
                      </div>
                    )}
                  </TabPane>
                )}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {relatedProducts.length > 0 && (
        <Row>
          <Col xl={12}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <h5 className="mb-4">
                  <i className="mdi mdi-cart-variant me-2"></i>
                  Productos relacionados
                </h5>
                <Row>
                  {relatedProducts.map((relProduct) => (
                    <Col key={relProduct.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                      <Card
                        className="border h-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onViewRelated(relProduct)}
                      >
                        <div
                          style={{
                            height: '150px',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={relProduct.mainImage}
                            alt={relProduct.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <CardBody className="p-2">
                          <h6 className="font-size-13 mb-1">{relProduct.name}</h6>
                          <p className="text-primary fw-medium mb-0">
                            ${relProduct.price.toLocaleString()}
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductDetailView;
