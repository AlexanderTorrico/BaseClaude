import React, { useState } from "react";
import { Container, Badge, ButtonGroup, Button, Row, Col, Input } from "reactstrap";
import AzHeaderCardViewResponsive from "../../../../components/aziende/AzHeader/AzHeaderCardViewResponsive";
import { AzTable, AzTableColumns } from "../../../../components/aziende/AzTable";
import AzFilterSummary from "../../../../components/aziende/AzFilterSummary";

// Test importing the hook step by step
// import useCrudBasic from "./Hooks/crudBasicHook";

const CrudBasicResponsive = () => {
  // Test basic state first
  const [testState, setTestState] = useState("Hello World");

  // Mock data for testing
  const mockProducts = [
    {
      id: 1,
      name: "Producto Test 1",
      category: "Electrónicos",
      description: "Descripción de prueba",
      price: 99.99,
      stock: 25,
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Producto Test 2",
      category: "Ropa",
      description: "Descripción de prueba 2",
      price: 49.99,
      stock: 10,
      createdAt: "2024-01-02"
    }
  ];

  // Try adding the hook gradually
  // const crudHook = useCrudBasic();

  // Mock selected items for testing
  const [selectedItems, setSelectedItems] = useState([]);

  // Shared filter state
  const [sharedFilters, setSharedFilters] = useState({});
  const [sharedSorting, setSharedSorting] = useState({});

  // Handle selection
  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Shared filter handlers
  const handleSharedFilterChange = (key, value) => {
    const newFilters = { ...sharedFilters, [key]: value };
    if (!value || value === '') {
      delete newFilters[key];
    }
    setSharedFilters(newFilters);
  };

  const handleSharedSortChange = (sortConfig) => {
    setSharedSorting(sortConfig);
  };

  const handleSharedClearAll = () => {
    setSharedFilters({});
    setSharedSorting({});
  };

  // Apply filters and sorting to data
  const getFilteredData = () => {
    let filtered = [...mockProducts];

    // Apply filters
    Object.keys(sharedFilters).forEach(key => {
      const value = sharedFilters[key];
      if (value) {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          return itemValue?.toString().includes(value);
        });
      }
    });

    // Apply sorting
    if (sharedSorting.field && sharedSorting.direction) {
      filtered.sort((a, b) => {
        const aVal = a[sharedSorting.field];
        const bVal = b[sharedSorting.field];

        if (typeof aVal === 'string') {
          const result = aVal.localeCompare(bVal);
          return sharedSorting.direction === 'asc' ? result : -result;
        }

        const result = aVal - bVal;
        return sharedSorting.direction === 'asc' ? result : -result;
      });
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const hasActiveItems = Object.keys(sharedFilters).length > 0 || (sharedSorting.field && sharedSorting.direction);

  // Create shared filter state object
  const sharedFilterState = {
    filteredData,
    hasActiveItems,
    filters: sharedFilters,
    sorting: sharedSorting,
    onFilterChange: handleSharedFilterChange,
    onSortChange: handleSharedSortChange,
    onClearAll: handleSharedClearAll
  };

  // Define table columns for AzTable
  const columns = [
    {
      key: "name",
      header: "Producto",
      sortable: true,
      filterable: true,
      filterType: "text",
      cell: AzTableColumns.Text({ className: "fw-medium" })
    },
    {
      key: "category",
      header: "Categoría",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["Electrónicos", "Ropa", "Hogar", "Deportes"],
      cell: AzTableColumns.Text({ className: "text-muted" })
    },
    {
      key: "price",
      header: "Precio",
      sortable: true,
      filterable: true,
      filterType: "text",
      cell: AzTableColumns.Currency({
        locale: "es-ES",
        currency: "USD",
        className: "fw-bold text-success"
      })
    },
    {
      key: "stock",
      header: "Stock",
      sortable: true,
      filterable: true,
      filterType: "text",
      cell: ({ value }) => {
        const getStockStatus = (stock) => {
          if (stock > 20) return { color: 'success', text: 'En Stock' };
          if (stock > 5) return { color: 'warning', text: 'Poco Stock' };
          return { color: 'danger', text: 'Sin Stock' };
        };

        const status = getStockStatus(value);

        return (
          <div>
            <span className="fw-medium">{value} unidades</span>
            <br />
            <Badge color={status.color} className="mt-1">
              {status.text}
            </Badge>
          </div>
        );
      }
    },
    {
      key: "createdAt",
      header: "Fecha Creación",
      sortable: true,
      filterable: true,
      filterType: "text",
      cell: AzTableColumns.Date({ locale: "es-ES", showTime: false })
    },
    {
      key: "actions",
      header: "Acciones",
      sortable: false,
      filterable: false,
      cell: ({ row }) => (
        <ButtonGroup size="sm">
          <Button
            color="primary"
            onClick={() => setTestState(`Editando: ${row.name}`)}
            title="Editar producto"
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            onClick={() => setTestState(`Eliminando: ${row.name}`)}
            title="Eliminar producto"
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </ButtonGroup>
      )
    }
  ];

  // Columns configuration for FilterSummary (simplified)
  const filterColumns = [
    { key: "name", header: "Nombre", filterType: "text" },
    {
      key: "category",
      header: "Categoría",
      filterType: "select",
      filterOptions: ["Electrónicos", "Ropa", "Hogar", "Deportes"]
    },
    { key: "price", header: "Precio", filterType: "text" },
    { key: "stock", header: "Stock", filterType: "text" }
  ];

  // Render AzTable view for web (sin controles de filtro, pero usa datos de AzFilterSummary)
  const renderWebViewWithData = (filterState) => (
    <>
      {/* Results count and bulk actions only */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h6 className="text-muted mb-0">
          Mostrando {filterState.filteredData.length} de {mockProducts.length} productos
          {filterState.hasActiveItems && <span className="text-primary"> (filtrados)</span>}
        </h6>

        {selectedItems.length > 0 && (
          <Button
            color="danger"
            size="sm"
            onClick={() => {
              setTestState(`Eliminando ${selectedItems.length} productos`);
              setSelectedItems([]);
            }}
          >
            <i className="mdi mdi-delete me-1"></i>
            Eliminar seleccionados ({selectedItems.length})
          </Button>
        )}
      </div>

      {/* AzTable with filtered data - vinculado con AzFilterSummary */}
      <AzTable
        data={filterState.filteredData}
        columns={columns}
        selectedItems={selectedItems}
        onSelectedChange={handleSelectItem}
        pagination={true}
        className="table-responsive"
        // Vinculación con AzFilterSummary
        filters={filterState.filters}
        sorting={filterState.sorting}
        onFilterChange={filterState.onFilterChange}
        onSortChange={filterState.onSortChange}
        onClearFilters={filterState.onClearAll}
      />

      {/* Empty state */}
      {filterState.filteredData.length === 0 && (
        <div className="text-center py-5">
          <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
            <i className="mdi mdi-package-variant mdi-36px text-muted"></i>
          </div>
          <h5 className="mb-3">No se encontraron productos</h5>
          <p className="text-muted mb-0">
            {filterState.hasActiveItems
              ? "No hay productos que coincidan con los filtros aplicados."
              : "No hay productos registrados en el sistema."}
          </p>
        </div>
      )}
    </>
  );

  // Render Table view (con controles de filtro externos usando AzFilterSummary)
  const renderTableViewWithFilters = (filterState) => (
    <>
      {/* Filter Controls */}
      <div className="mb-4">
        <Row className="g-3 align-items-end">
          <Col lg={3} md={6}>
            <label className="form-label small">Buscar producto</label>
            <Input
              type="text"
              size="sm"
              placeholder="Nombre del producto..."
              value={filterState.filters.name || ""}
              onChange={(e) => filterState.onFilterChange("name", e.target.value)}
            />
          </Col>

          <Col lg={3} md={6}>
            <label className="form-label small">Categoría</label>
            <Input
              type="select"
              size="sm"
              value={filterState.filters.category || ""}
              onChange={(e) => filterState.onFilterChange("category", e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {filterColumns.find(c => c.key === 'category')?.filterOptions?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Input>
          </Col>

          <Col lg={2} md={4}>
            <label className="form-label small">Ordenar por</label>
            <Input
              type="select"
              size="sm"
              value={filterState.sorting.field || ""}
              onChange={(e) => filterState.onSortChange({ field: e.target.value, direction: filterState.sorting.direction || "asc" })}
            >
              <option value="">Sin orden</option>
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
            </Input>
          </Col>

          <Col lg={2} md={2}>
            <label className="form-label small">Dirección</label>
            <ButtonGroup size="sm" className="w-100">
              <Button
                color={filterState.sorting.direction === 'asc' ? 'primary' : 'outline-primary'}
                onClick={() => filterState.onSortChange({ field: filterState.sorting.field || "", direction: "asc" })}
                disabled={!filterState.sorting.field}
              >
                <i className="mdi mdi-arrow-up"></i>
              </Button>
              <Button
                color={filterState.sorting.direction === 'desc' ? 'primary' : 'outline-primary'}
                onClick={() => filterState.onSortChange({ field: filterState.sorting.field || "", direction: "desc" })}
                disabled={!filterState.sorting.field}
              >
                <i className="mdi mdi-arrow-down"></i>
              </Button>
            </ButtonGroup>
          </Col>

          <Col lg={2} md={6}>
            <Button
              color="outline-secondary"
              size="sm"
              onClick={filterState.onClearAll}
              className="w-100"
            >
              <i className="mdi mdi-close me-1"></i>
              Limpiar
            </Button>
          </Col>
        </Row>
      </div>

      {/* Results count */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h6 className="text-muted mb-0">
          Mostrando {filterState.filteredData.length} de {mockProducts.length} productos
          {filterState.hasActiveItems && <span className="text-primary"> (filtrados)</span>}
        </h6>

        {selectedItems.length > 0 && (
          <Button
            color="danger"
            size="sm"
            onClick={() => {
              setTestState(`Eliminando ${selectedItems.length} productos`);
              setSelectedItems([]);
            }}
          >
            <i className="mdi mdi-delete me-1"></i>
            Eliminar seleccionados ({selectedItems.length})
          </Button>
        )}
      </div>

      {/* AzTable with filtered data - vinculado con AzFilterSummary */}
      <AzTable
        data={filterState.filteredData}
        columns={columns}
        selectedItems={selectedItems}
        onSelectedChange={handleSelectItem}
        pagination={true}
        className="table-responsive"
        // Vinculación con AzFilterSummary
        filters={filterState.filters}
        sorting={filterState.sorting}
        onFilterChange={filterState.onFilterChange}
        onSortChange={filterState.onSortChange}
        onClearFilters={filterState.onClearAll}
      />

      {/* Empty state */}
      {filterState.filteredData.length === 0 && (
        <div className="text-center py-5">
          <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
            <i className="mdi mdi-package-variant mdi-36px text-muted"></i>
          </div>
          <h5 className="mb-3">No se encontraron productos</h5>
          <p className="text-muted mb-0">
            {filterState.hasActiveItems
              ? "No hay productos que coincidan con los filtros aplicados."
              : "No hay productos registrados en el sistema."}
          </p>
        </div>
      )}
    </>
  );

  // Render cards view for mobile with AzFilterSummary
  const renderMobileViewWithFilters = (filterState) => (
    <>
      {/* Mobile Filter Controls */}
      <div className="mb-4">
        <Row className="g-3">
          {/* Search input */}
          <Col xs={12}>
            <Input
              type="text"
              size="sm"
              placeholder="Buscar productos..."
              value={filterState.filters.name || ""}
              onChange={(e) => filterState.onFilterChange("name", e.target.value)}
            />
          </Col>

          {/* Category filter and clear button */}
          <Col xs={8}>
            <Input
              type="select"
              size="sm"
              value={filterState.filters.category || ""}
              onChange={(e) => filterState.onFilterChange("category", e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {filterColumns.find(c => c.key === 'category')?.filterOptions?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Input>
          </Col>

          <Col xs={4}>
            <Button
              color="outline-secondary"
              size="sm"
              onClick={filterState.onClearAll}
              className="w-100"
              title="Limpiar filtros"
            >
              <i className="mdi mdi-close"></i>
            </Button>
          </Col>
        </Row>
      </div>

      {/* Results count */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <small className="text-muted">
          {filterState.filteredData.length} de {mockProducts.length} productos
          {filterState.hasActiveItems && <span className="text-primary"> (filtrados)</span>}
        </small>

        {selectedItems.length > 0 && (
          <Button
            color="danger"
            size="sm"
            onClick={() => {
              setTestState(`Eliminando ${selectedItems.length} productos`);
              setSelectedItems([]);
            }}
          >
            <i className="mdi mdi-delete me-1"></i>
            Eliminar ({selectedItems.length})
          </Button>
        )}
      </div>

      {/* Cards Grid */}
      <Row>
        {filterState.filteredData.length > 0 ? (
          filterState.filteredData.map(product => (
                <Col xs={12} sm={6} lg={4} key={product.id} className="mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedItems.includes(product.id)}
                              onChange={() => handleSelectItem(product.id)}
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
                        <Badge color={
                          product.stock > 20 ? 'success' :
                          product.stock > 5 ? 'warning' : 'danger'
                        }>
                          {product.stock > 20 ? 'En Stock' :
                           product.stock > 5 ? 'Poco Stock' : 'Sin Stock'}
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
                        <small className="text-muted">Fecha:</small>
                        <p className="mb-0">
                          {new Date(product.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => setTestState(`Editando: ${product.name}`)}
                          className="flex-fill"
                        >
                          <i className="mdi mdi-pencil me-1"></i>
                          Editar
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => setTestState(`Eliminando: ${product.name}`)}
                          className="flex-fill"
                        >
                          <i className="mdi mdi-delete me-1"></i>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center py-5">
                  <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
                    <i className="mdi mdi-package-variant mdi-36px text-muted"></i>
                  </div>
                  <h5 className="mb-3">No se encontraron productos</h5>
                  <p className="text-muted mb-0">
                    {filterState.hasActiveItems
                      ? "No hay productos que coincidan con los filtros aplicados."
                      : "No hay productos registrados en el sistema."}
                  </p>
                </div>
              </Col>
            )}
          </Row>
      </>
    );

  return (
    <div className="page-content">
      <Container fluid>
        <AzHeaderCardViewResponsive
          title="Gestión de Productos"
          description="Administra tu catálogo de productos de forma eficiente"
          badge={{
            count: mockProducts.length,
            text: "productos",
            color: "primary"
          }}
          views={[
            { name: "Web", icon: "mdi-monitor" },
            { name: "Tabla", icon: "mdi-table" },
            { name: "Móvil", icon: "mdi-cellphone" }
          ]}
          contentTopRight={
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm">
                <i className="mdi mdi-plus me-1"></i>
                Nuevo Producto
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setTestState("Refreshed!")}
              >
                <i className="mdi mdi-refresh"></i>
              </button>
            </div>
          }
          viewWeb={
            <AzFilterSummary data={mockProducts} columns={filterColumns}>
              {(filterState) => renderWebViewWithData(filterState)}
            </AzFilterSummary>
          }
          viewTable={
            <AzFilterSummary data={mockProducts} columns={filterColumns}>
              {(filterState) => renderWebViewWithData(filterState)}
            </AzFilterSummary>
          }
          viewMovil={
            <AzFilterSummary data={mockProducts} columns={filterColumns}>
              {(filterState) => renderMobileViewWithFilters(filterState)}
            </AzFilterSummary>
          }
        />
      </Container>
    </div>
  );
};

export default CrudBasicResponsive;