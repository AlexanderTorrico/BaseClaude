import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
  creating = false
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

    if (!validateForm()) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      createdAt: new Date().toISOString()
    };

    try {
      await onCreate(productData);
      handleClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error creating product:", error);
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

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        <i className="mdi mdi-plus me-2 text-success"></i>
        Crear Nuevo Producto
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {Object.keys(errors).length > 0 && (
            <Alert color="danger" className="mb-3">
              <small>Por favor corrige los errores marcados en el formulario.</small>
            </Alert>
          )}

          <FormGroup>
            <Label for="productName">
              Nombre del Producto <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              id="productName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre del producto"
              invalid={!!errors.name}
              disabled={creating}
            />
            {errors.name && (
              <div className="invalid-feedback d-block">
                {errors.name}
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="productCategory">
              Categoría <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              id="productCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
              invalid={!!errors.category}
              disabled={creating}
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
            <Label for="productDescription">Descripción</Label>
            <Input
              type="textarea"
              id="productDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto (opcional)"
              rows={3}
              disabled={creating}
            />
          </FormGroup>

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="productPrice">
                  Precio (USD) <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id="productPrice"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  invalid={!!errors.price}
                  disabled={creating}
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
                <Label for="productStock">
                  Stock <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id="productStock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  invalid={!!errors.stock}
                  disabled={creating}
                />
                {errors.stock && (
                  <div className="invalid-feedback d-block">
                    {errors.stock}
                  </div>
                )}
              </FormGroup>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            color="secondary"
            onClick={handleClose}
            disabled={creating}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            color="success"
            disabled={creating}
          >
            {creating ? (
              <>
                <i className="mdi mdi-loading mdi-spin me-2"></i>
                Creando...
              </>
            ) : (
              <>
                <i className="mdi mdi-check me-2"></i>
                Crear Producto
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

CreateProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  creating: PropTypes.bool
};

export default CreateProductModal;