import React, { useState, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Collapse,
  Alert
} from "reactstrap";

// Datos estáticos iniciales para productos
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Producto Test 1",
    category: "Electrónicos",
    description: "Descripción de prueba del producto 1",
    price: 99.99,
    stock: 25,
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Producto Test 2",
    category: "Ropa",
    description: "Descripción de prueba del producto 2",
    price: 49.99,
    stock: 10,
    createdAt: "2024-01-02"
  },
  {
    id: 3,
    name: "Producto Test 3",
    category: "Hogar",
    description: "Descripción de prueba del producto 3",
    price: 79.99,
    stock: 5,
    createdAt: "2024-01-03"
  }
];

// Opciones de filtro estáticas
const CATEGORY_OPTIONS = ["Electrónicos", "Ropa", "Hogar", "Deportes"];

const CrudKilo = () => {
  // Estado para la lista de productos
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: ''
  });

  // Estado para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: ''
  });

  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // Estado para vista (table/cards)
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Estado para filtros expandidos
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Estado para alertas
  const [alert, setAlert] = useState(null);

  // Funciones CRUD
  const handleCreate = useCallback(() => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      stock: ''
    });
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showAlert('Producto eliminado exitosamente', 'success');
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) {
      showAlert('El nombre es obligatorio', 'danger');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0
    };

    if (editingProduct) {
      // Actualizar producto existente
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...productData }
          : p
      ));
      showAlert('Producto actualizado exitosamente', 'success');
    } else {
      // Crear nuevo producto
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts(prev => [...prev, newProduct]);
      showAlert('Producto creado exitosamente', 'success');
    }

    setModalOpen(false);
  }, [formData, editingProduct, products]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
    setEditingProduct(null);
  }, []);

  // Función para mostrar alertas
  const showAlert = useCallback((message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  }, []);

  // Función para ordenar
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Función para aplicar filtros y búsqueda
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      // Búsqueda general
      const searchMatch = !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtros específicos
      const categoryMatch = !filters.category || product.category === filters.category;
      const minPriceMatch = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
      const maxPriceMatch = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
      const minStockMatch = !filters.minStock || product.stock >= parseInt(filters.minStock);
      const maxStockMatch = !filters.maxStock || product.stock <= parseInt(filters.maxStock);

      return searchMatch && categoryMatch && minPriceMatch && maxPriceMatch && minStockMatch && maxStockMatch;
    });

    // Ordenar
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, filters, sortConfig]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: ''
    });
  }, []);

  // Función para obtener el estado del stock
  const getStockStatus = useCallback((stock) => {
    if (stock > 20) return { color: 'success', text: 'En Stock' };
    if (stock > 5) return { color: 'warning', text: 'Poco Stock' };
    return { color: 'danger', text: 'Sin Stock' };
  }, []);

  // Renderizar vista de tabla
  const renderTableView = () => (
    <div className="table-responsive">
      <Table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Producto {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
              Categoría {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
              Precio {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
              Stock {sortConfig.key === 'stock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
              Fecha {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedProducts.map(product => (
            <tr key={product.id}>
              <td>
                <div>
                  <strong>{product.name}</strong>
                  <br />
                  <small className="text-muted">{product.description}</small>
                </div>
              </td>
              <td>{product.category}</td>
              <td className="fw-bold text-success">
                ${product.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </td>
              <td>
                <Badge color={getStockStatus(product.stock).color}>
                  {product.stock} - {getStockStatus(product.stock).text}
                </Badge>
              </td>
              <td>{new Date(product.createdAt).toLocaleDateString('es-ES')}</td>
              <td>
                <div className="btn-group btn-group-sm">
                  <Button
                    color="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    title="Editar"
                  >
                    <i className="mdi mdi-pencil"></i>
                  </Button>
                  <Button
                    color="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    title="Eliminar"
                  >
                    <i className="mdi mdi-delete"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // Renderizar vista de cards
  const renderCardsView = () => (
    <Row>
      {filteredAndSortedProducts.map(product => (
        <Col lg={4} md={6} key={product.id} className="mb-4">
          <Card className="h-100 shadow-sm">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">{product.name}</h6>
              <Badge color={getStockStatus(product.stock).color}>
                {getStockStatus(product.stock).text}
              </Badge>
            </CardHeader>
            <CardBody>
              <p className="text-muted small mb-2">{product.description}</p>

              <div className="row mb-3">
                <div className="col-6">
                  <small className="text-muted d-block">Categoría</small>
                  <span className="fw-medium">{product.category}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Precio</small>
                  <span className="fw-bold text-success">
                    ${product.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <small className="text-muted d-block">Stock</small>
                  <span>{product.stock} unidades</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Fecha</small>
                  <span>{new Date(product.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-fill"
                >
                  <i className="mdi mdi-pencil me-1"></i>
                  Editar
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="flex-fill"
                >
                  <i className="mdi mdi-delete me-1"></i>
                  Eliminar
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div className="page-content">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Gestión de Productos</h4>
                <p className="text-muted mb-0">Administra tu catálogo de productos</p>
              </div>
              <Button color="primary" onClick={handleCreate}>
                <i className="mdi mdi-plus me-1"></i>
                Nuevo Producto
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alertas */}
        {alert && (
          <Row className="mb-3">
            <Col>
              <Alert color={alert.type} toggle={() => setAlert(null)}>
                {alert.message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Barra de búsqueda y controles */}
        <Row className="mb-3">
          <Col>
            <Card>
              <CardBody className="py-3">
                <Row className="align-items-center">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroupText>
                        <i className="mdi mdi-magnify"></i>
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        color="outline-secondary"
                        size="sm"
                        onClick={() => setFiltersExpanded(!filtersExpanded)}
                      >
                        <i className="mdi mdi-filter me-1"></i>
                        Filtros
                      </Button>
                      <div className="btn-group btn-group-sm">
                        <Button
                          color={viewMode === 'table' ? 'primary' : 'outline-primary'}
                          onClick={() => setViewMode('table')}
                        >
                          <i className="mdi mdi-table"></i>
                        </Button>
                        <Button
                          color={viewMode === 'cards' ? 'primary' : 'outline-primary'}
                          onClick={() => setViewMode('cards')}
                        >
                          <i className="mdi mdi-view-grid"></i>
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Filtros expandidos */}
                <Collapse isOpen={filtersExpanded}>
                  <hr />
                  <Row className="mt-3">
                    <Col md={2}>
                      <FormGroup>
                        <Label for="filterCategory">Categoría</Label>
                        <Input
                          id="filterCategory"
                          type="select"
                          value={filters.category}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="">Todas</option>
                          {CATEGORY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="minPrice">Precio Mín</Label>
                        <Input
                          id="minPrice"
                          type="number"
                          placeholder="0"
                          value={filters.minPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="maxPrice">Precio Máx</Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          placeholder="9999"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="minStock">Stock Mín</Label>
                        <Input
                          id="minStock"
                          type="number"
                          placeholder="0"
                          value={filters.minStock}
                          onChange={(e) => setFilters(prev => ({ ...prev, minStock: e.target.value }))}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label for="maxStock">Stock Máx</Label>
                        <Input
                          id="maxStock"
                          type="number"
                          placeholder="999"
                          value={filters.maxStock}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxStock: e.target.value }))}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>&nbsp;</Label>
                        <div>
                          <Button color="outline-secondary" size="sm" onClick={clearFilters}>
                            <i className="mdi mdi-close me-1"></i>
                            Limpiar
                          </Button>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Collapse>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Contador de resultados */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">
                Mostrando {filteredAndSortedProducts.length} de {products.length} productos
              </span>
              {filteredAndSortedProducts.length === 0 && (
                <span className="text-warning">
                  <i className="mdi mdi-alert-circle me-1"></i>
                  No se encontraron productos
                </span>
              )}
            </div>
          </Col>
        </Row>

        {/* Vista de datos */}
        <Row>
          <Col>
            {viewMode === 'table' ? renderTableView() : renderCardsView()}
          </Col>
        </Row>
      </Container>

      {/* Modal para crear/editar */}
      <Modal isOpen={modalOpen} toggle={handleCancel} size="lg">
        <ModalHeader toggle={handleCancel}>
          {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Nombre *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ingrese el nombre del producto"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="category">Categoría</Label>
                  <Input
                    id="category"
                    type="select"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Seleccionar categoría</option>
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="description">Descripción</Label>
              <Input
                id="description"
                type="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Ingrese la descripción del producto"
              />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="0"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSave}>
            {editingProduct ? 'Actualizar' : 'Crear'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CrudKilo;