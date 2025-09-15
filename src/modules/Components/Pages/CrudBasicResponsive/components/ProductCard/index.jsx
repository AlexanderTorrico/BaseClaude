import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Badge, Button } from "reactstrap";

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
  isDeleting = false,
  isUpdating = false
}) => {
  const getStatusColor = (stock) => {
    if (stock > 50) return 'success';
    if (stock > 10) return 'warning';
    return 'danger';
  };

  const getStatusText = (stock) => {
    if (stock > 50) return 'En Stock';
    if (stock > 10) return 'Poco Stock';
    return 'Sin Stock';
  };

  const handleEdit = () => {
    onEdit?.(product);
  };

  const handleDelete = () => {
    onDelete?.(product.id);
  };

  const handleSelect = () => {
    onSelect?.(product.id);
  };

  return (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="form-check me-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                disabled={isDeleting || isUpdating}
              />
            </div>
            <div className="avatar-sm rounded bg-light d-flex align-items-center justify-content-center me-3">
              <i className="mdi mdi-package-variant mdi-18px text-primary"></i>
            </div>
            <div>
              <h6 className="mb-1">{product.name}</h6>
              <p className="text-muted mb-0 small">{product.category}</p>
            </div>
          </div>
          <Badge color={getStatusColor(product.stock)}>
            {getStatusText(product.stock)}
          </Badge>
        </div>

        <div className="mb-2">
          <small className="text-muted">Descripción:</small>
          <p className="mb-1 text-truncate" title={product.description}>
            {product.description}
          </p>
        </div>

        <div className="row mb-2">
          <div className="col-6">
            <small className="text-muted">Precio:</small>
            <p className="mb-0 fw-bold text-success">
              ${product.price?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="col-6">
            <small className="text-muted">Stock:</small>
            <p className="mb-0">{product.stock} unidades</p>
          </div>
        </div>

        <div className="mb-3">
          <small className="text-muted">Fecha Creación:</small>
          <p className="mb-0">
            {new Date(product.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Button
            color="primary"
            size="sm"
            onClick={handleEdit}
            disabled={isDeleting || isUpdating}
            className="flex-fill"
          >
            <i className="mdi mdi-pencil me-1"></i>
            Editar
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="flex-fill"
          >
            <i className="mdi mdi-delete me-1"></i>
            Eliminar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  isDeleting: PropTypes.bool,
  isUpdating: PropTypes.bool
};

export default ProductCard;