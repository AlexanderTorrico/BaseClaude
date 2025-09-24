import React, { useMemo, useCallback } from "react";
import { Container, Badge, Button, ButtonGroup, Row, Col, Input } from "reactstrap";
import AzHeaderCardViewResponsive from "../../../../components/aziende/AzHeader/AzHeaderCardViewResponsive";
import { AzTable, AzTableColumns } from "../../../../components/aziende/AzTable";
import AzFilterSummary from "../../../../components/aziende/AzFilterSummary";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
}

// Datos estáticos movidos fuera del componente para evitar recreación
const MOCK_PRODUCTS: Product[] = [
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

// Opciones de filtro estáticas
const CATEGORY_OPTIONS = ["Electrónicos", "Ropa", "Hogar", "Deportes"];

const CrudBasicResponsive: React.FC = () => {
  // Handlers optimizados con useCallback
  const handleEdit = useCallback((productName) => {
    console.log(`Editando: ${productName}`);
  }, []);

  const handleDelete = useCallback((productName) => {
    console.log(`Eliminando: ${productName}`);
  }, []);

  const handleRefresh = useCallback(() => {
    console.log("Refreshed!");
  }, []);

  // Definición de columnas optimizada con useMemo
  const columns = useMemo(() => [
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
      filterOptions: CATEGORY_OPTIONS,
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
            onClick={() => handleEdit(row.name)}
            title="Editar producto"
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            onClick={() => handleDelete(row.name)}
            title="Eliminar producto"
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </ButtonGroup>
      )
    }
  ], [handleEdit, handleDelete]);

  // Configuración de columnas para FilterSummary optimizada
  const filterColumns = useMemo(() => [
    { key: "name", header: "Nombre", filterType: "text" },
    {
      key: "category",
      header: "Categoría",
      filterType: "select",
      filterOptions: CATEGORY_OPTIONS
    },
    { key: "price", header: "Precio", filterType: "text" },
    { key: "stock", header: "Stock", filterType: "text" }
  ], []);

  // Render functions optimizadas con useCallback
  const renderWebViewWithData = useCallback((filterState) => (
    <>
      {/* AzTable with filtered data - vinculado con AzFilterSummary */}
      <AzTable
        data={filterState.filteredData}
        columns={columns}
        pagination={false}
        className="table-responsive"
        // Vinculación con AzFilterSummary
        filters={filterState.filters}
        sorting={filterState.sorting}
        onFilterChange={filterState.onFilterChange}
        onSortChange={filterState.onSortChange}
        onClearFilters={filterState.onClearAll}
      />
    </>
  ), [columns]);

  const renderMobileViewWithFilters = useCallback((filterState) => (
    <>
      {/* Mobile Filter Controls */}
      <div className="mb-4">
        <Row className="g-3">
          {/* Search input */}
          <Col xs={12}>
            <Input
              type="text"
              bsSize="sm"
              placeholder="Buscar productos..."
              value={filterState.filters.name || ""}
              onChange={(e) => filterState.onFilterChange("name", e.target.value)}
            />
          </Col>

          {/* Category filter and clear button */}
          <Col xs={8}>
            <Input
              type="select"
              bsSize="sm"
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

      {/* Cards Grid */}
      <Row>
        {filterState.filteredData.length > 0 ? (
          filterState.filteredData.map(product => (
                <Col xs={12} sm={6} lg={4} key={product.id} className="mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center">
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
                          onClick={() => console.log(`Editando: ${product.name}`)}
                          className="flex-fill"
                        >
                          <i className="mdi mdi-pencil me-1"></i>
                          Editar
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => console.log(`Eliminando: ${product.name}`)}
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
    ), [filterColumns, handleEdit, handleDelete]);

  // Configuración optimizada de vistas
  const viewsConfig = useMemo(() => [
    { name: "Web", icon: "mdi-monitor" },
    { name: "Tabla", icon: "mdi-table" },
    { name: "Móvil", icon: "mdi-cellphone" }
  ], []);

  const badgeConfig = useMemo(() => ({
    count: MOCK_PRODUCTS.length,
    text: "productos",
    color: "primary"
  }), []);

  const contentTopRight = useMemo(() => (
    <div className="d-flex gap-2">
      <button className="btn btn-primary btn-sm">
        <i className="mdi mdi-plus me-1"></i>
        Nuevo Producto
      </button>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={handleRefresh}
      >
        <i className="mdi mdi-refresh"></i>
      </button>
    </div>
  ), [handleRefresh]);

  return (
    <div className="page-content">
      <Container fluid className="p-0">
        <AzHeaderCardViewResponsive
          title="Gestión de Productos"
          description="Administra tu catálogo de productos de forma eficiente"
          badge={badgeConfig}
          views={viewsConfig}
          contentTopRight={contentTopRight}
          viewWeb={
            <AzFilterSummary
              data={MOCK_PRODUCTS}
              columns={filterColumns}
              showCount="never"
              alwaysVisible={true}
            >
              {renderWebViewWithData}
            </AzFilterSummary>
          }
          viewTable={
            <AzFilterSummary
              data={MOCK_PRODUCTS}
              columns={filterColumns}
              showCount="auto"
              countPosition="top"
              alwaysVisible={true}
            >
              {renderWebViewWithData}
            </AzFilterSummary>
          }
          viewMovil={
            <AzFilterSummary
              data={MOCK_PRODUCTS}
              columns={filterColumns}
              showCount="always"
              countPosition="top"
              alwaysVisible={true}
            >
              {renderMobileViewWithFilters}
            </AzFilterSummary>
          }
        />
      </Container>
    </div>
  );
};

export default CrudBasicResponsive;