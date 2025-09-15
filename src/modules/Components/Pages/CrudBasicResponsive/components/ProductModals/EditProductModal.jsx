import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";

const EditProductModal = ({
  isOpen,
  onClose,
  onUpdate,
  product,
  updating = false
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: ""
  });

  const [errors, setErrors] = useState({});

  const categories = ["Electrónicos", "Ropa", "Hogar", "Deportes", "Libros"];

  // Initialize form data when product changes
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || ""
      });
      setErrors({});
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida";
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "El precio debe ser un número mayor a 0";
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = "El stock debe ser un número mayor o igual a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !product) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      updatedAt: new Date().toISOString()
    };

    try {
      await onUpdate(product.id, productData);
      handleClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error updating product:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      stock: ""
    });
    setErrors({});
    onClose();
  };

  if (!product) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        <i className="mdi mdi-pencil me-2 text-primary"></i>
        Editar Producto: {product.name}
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {Object.keys(errors).length > 0 && (
            <Alert color="danger" className="mb-3">
              <small>Por favor corrige los errores marcados en el formulario.</small>
            </Alert>
          )}

          <FormGroup>
            <Label for="editProductName">
              Nombre del Producto <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              id="editProductName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre del producto"
              invalid={!!errors.name}
              disabled={updating}
            />
            {errors.name && (
              <div className="invalid-feedback d-block">
                {errors.name}
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="editProductCategory">
              Categoría <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              id="editProductCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
              invalid={!!errors.category}
              disabled={updating}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Input>
            {errors.category && (
              <div className="invalid-feedback d-block">
                {errors.category}
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="editProductDescription">Descripción</Label>
            <Input
              type="textarea"
              id="editProductDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto (opcional)"
              rows={3}
              disabled={updating}
            />
          </FormGroup>

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="editProductPrice">
                  Precio (USD) <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id="editProductPrice"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  invalid={!!errors.price}
                  disabled={updating}
                />
                {errors.price && (
                  <div className="invalid-feedback d-block">
                    {errors.price}
                  </div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6">
              <FormGroup>
                <Label for="editProductStock">
                  Stock <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id="editProductStock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  invalid={!!errors.stock}
                  disabled={updating}
                />
                {errors.stock && (
                  <div className="invalid-feedback d-block">
                    {errors.stock}
                  </div>
                )}
              </FormGroup>
            </div>
          </div>

          {/* Product metadata */}
          <div className="mt-3 p-3 bg-light rounded">
            <div className="row text-muted small">
              <div className="col-md-6">
                <strong>ID:</strong> {product.id}
              </div>
              <div className="col-md-6">
                <strong>Creado:</strong> {new Date(product.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            color="secondary"
            onClick={handleClose}
            disabled={updating}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={updating}
          >
            {updating ? (
              <>
                <i className="mdi mdi-loading mdi-spin me-2"></i>
                Actualizando...
              </>
            ) : (
              <>
                <i className="mdi mdi-check me-2"></i>
                Actualizar Producto
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

EditProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  product: PropTypes.object,
  updating: PropTypes.bool
};

export default EditProductModal;