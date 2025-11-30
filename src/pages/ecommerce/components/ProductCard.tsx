import React from 'react';
import { Card, CardBody, Badge, Button } from 'reactstrap';
import { ProductModel } from '../models/ProductModel';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: ProductModel;
  onViewDetails: (product: ProductModel) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, canAddToCompare } = useCart();
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
      <Badge color={colors[product.condition]} className="me-1">
        {labels[product.condition]}
      </Badge>
    );
  };

  const getStatusBadge = () => {
    if (product.status === 'in_stock') {
      return (
        <Badge color="success" className="badge-soft-success">
          <i className="mdi mdi-check-circle me-1"></i>
          En stock
        </Badge>
      );
    }
    if (product.status === 'immediate_shipping') {
      return (
        <Badge color="primary" className="badge-soft-primary">
          <i className="mdi mdi-rocket me-1"></i>
          Envío inmediato
        </Badge>
      );
    }
    if (product.status === 'reservation') {
      return (
        <Badge color="warning" className="badge-soft-warning">
          <i className="mdi mdi-calendar-clock me-1"></i>
          Reserva
        </Badge>
      );
    }
    return (
      <Badge color="secondary" className="badge-soft-secondary">
        Agotado
      </Badge>
    );
  };

  return (
    <Card className="product-card border-0 shadow-sm h-100 w-100">
      <div
        className="product-image-wrapper position-relative"
        style={{
          height: '220px',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
          cursor: 'pointer',
        }}
        onClick={() => onViewDetails(product)}
      >
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 p-2">
          {getConditionBadge()}
          {product.tags.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} color="light" className="me-1">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1">
          <Button
            color={isInWishlist(product.id) ? 'danger' : 'light'}
            size="sm"
            className="rounded-circle p-0"
            style={{ width: '32px', height: '32px' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <i className={`mdi ${isInWishlist(product.id) ? 'mdi-heart' : 'mdi-heart-outline'}`}></i>
          </Button>
          {canAddToCompare() || isInCompare(product.id) ? (
            <Button
              color={isInCompare(product.id) ? 'info' : 'light'}
              size="sm"
              className="rounded-circle p-0"
              style={{ width: '32px', height: '32px' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(product);
              }}
            >
              <i className="mdi mdi-compare"></i>
            </Button>
          ) : null}
        </div>
      </div>

      <CardBody className="d-flex flex-column p-3">
        <div className="mb-2">
          <h6
            className="mb-1 fw-medium"
            style={{ cursor: 'pointer', minHeight: '40px' }}
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h6>
          <p className="text-muted mb-1 font-size-12">
            {product.brand} • {product.model} • {product.year}
          </p>
        </div>

        <div className="mb-2">
          <p className="text-muted mb-1 font-size-12">{product.shortDescription}</p>
        </div>

        <div className="mb-2">
          {product.highlights.slice(0, 3).map((highlight, idx) => (
            <div key={idx} className="d-flex align-items-start mb-1">
              <i className="mdi mdi-check-circle text-success font-size-14 me-2 mt-1"></i>
              <span className="font-size-12 text-muted">{highlight}</span>
            </div>
          ))}
          {product.highlights.length > 3 && (
            <span className="font-size-11 text-primary">
              +{product.highlights.length - 3} más
            </span>
          )}
        </div>

        {product.usage && (
          <div className="mb-2">
            {product.usage.kilometers !== undefined && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-speedometer text-muted font-size-14 me-2"></i>
                <span className="font-size-12 text-muted">
                  {product.usage.kilometers.toLocaleString()} km
                </span>
              </div>
            )}
            {product.usage.hours !== undefined && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-clock-outline text-muted font-size-14 me-2"></i>
                <span className="font-size-12 text-muted">
                  {product.usage.hours.toLocaleString()} horas
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mb-3">{getStatusBadge()}</div>

        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div>
              <h4 className="mb-0 text-primary fw-bold">
                ${product.price.toLocaleString()}
              </h4>
              <p className="text-muted mb-0 font-size-11">
                {product.vatIncluded ? 'IVA incluido' : 'IVA no incluido'}
              </p>
            </div>
            {product.rating && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-star text-warning font-size-16"></i>
                <span className="ms-1 fw-medium">{product.rating}</span>
                {product.reviews && (
                  <span className="ms-1 text-muted font-size-12">
                    ({product.reviews})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              style={{ flex: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
            >
              <i className="mdi mdi-cart-plus me-1"></i>
              Agregar
            </Button>
            <Button
              color="light"
              size="sm"
              onClick={() => onViewDetails(product)}
            >
              <i className="mdi mdi-eye"></i>
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
