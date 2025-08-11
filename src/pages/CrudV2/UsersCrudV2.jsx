import React from "react";
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
import DeleteModal from "../../components/Common/DeleteModal";
import UserCardsView from "./components/UserCardsView";
import UserTableView from "./components/UserTableView";
import UserModal from "./components/UserModal";
import { useUserData } from "./hooks/useUserData.jsx";
import { useUserFilters } from "./hooks/useUserFilters.jsx";
import { useUserActions } from "./hooks/useUserActions.jsx";
import "./UsersCrudV2.css";

const UsersCrudV2 = () => {
  // Custom hooks
  const { usuarios, setUsuarios, modoVista, setModoVista } = useUserData();
  const {
    columnFilters,
    sorting,
    cardSearchTerm,
    cardSorting,
    usuariosFiltrados,
    usuariosFiltradosCards,
    handleColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    handleSort,
    clearSorting,
    clearAll,
    handleCardSearchChange,
    handleCardSortFieldChange,
    handleCardSortDirectionChange,
    clearCardFilters,
    getActiveCardFilters,
    getActiveFilters
  } = useUserFilters(usuarios);
  
  const {
    modalAbierto,
    modalEliminar,
    usuariosSeleccionados,
    esEdicion,
    datosFormulario,
    setUsuariosSeleccionados,
    setDatosFormulario,
    manejarAgregarUsuario,
    manejarEditarUsuario,
    manejarEliminarUsuario,
    manejarGuardarUsuario,
    confirmarEliminar,
    manejarEliminarMasivo,
    toggleModal,
    toggleDeleteModal
  } = useUserActions(usuarios, setUsuarios);

  return (
    <React.Fragment>
      <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <h4 className="mb-0">Gestión de Usuarios V2</h4>
              <p className="text-muted mb-md-0 mb-3">
                Sistema moderno de administración de usuarios con filtros de columna
                {(getActiveFilters().length > 0 || (sorting.column && sorting.direction)) && (
                  <span className="ms-2">
                    <Badge color="info" style={{ fontSize: '0.65rem' }}>
                      <i className="mdi mdi-filter-check me-1"></i>
                      {usuariosFiltrados.length} de {usuarios.length} resultados
                    </Badge>
                  </span>
                )}
              </p>
            </Col>
            <Col lg={6} md={12} className="text-lg-end text-center">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
    
                <Button color="primary" onClick={manejarAgregarUsuario} size="sm">
                  <i className="mdi mdi-plus me-1"></i>
                  Nuevo Usuario
                </Button>
                
                {usuariosSeleccionados.length > 0 && (
                  <Button color="danger" outline onClick={manejarEliminarMasivo} size="sm">
                    <i className="mdi mdi-delete me-1"></i>
                    Eliminar ({usuariosSeleccionados.length})
                  </Button>
                )}

                <div className="btn-group d-none d-md-flex" role="group">
                  <Button 
                    color={modoVista === 'cards' ? 'primary' : 'light'}
                    onClick={() => setModoVista('cards')}
                    size="sm"
                    title="Vista de tarjetas"
                  >
                    <i className="mdi mdi-view-grid"></i>
                  </Button>
                  <Button 
                    color={modoVista === 'table' ? 'primary' : 'light'}
                    onClick={() => setModoVista('table')}
                    size="sm"
                    title="Vista de tabla"
                  >
                    <i className="mdi mdi-view-list"></i>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Resumen de filtros y ordenamiento activos */}
          {(getActiveFilters().length > 0 || (sorting.column && sorting.direction)) && (
            <Row className="mt-3">
              <Col xs={12}>
                <div className="active-filters-container p-3 bg-light rounded">
                  <div className="d-flex align-items-start flex-wrap">
                    <span className="text-muted small me-2 fw-medium mb-2">
                      <i className="mdi mdi-filter-check me-1"></i>
                      Filtros y ordenamiento activos:
                    </span>
                    
                    {/* Mostrar ordenamiento activo */}
                    {sorting.column && sorting.direction && (
                      <Badge 
                        color="white" 
                        className="border border-info me-2 mb-2 d-flex align-items-center shadow-sm"
                        style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                      >
                        <i className={`mdi ${sorting.direction === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'} me-2 text-info`}></i>
                        <span className="fw-medium text-dark text-capitalize">{sorting.column}</span>
                        <span className="text-muted mx-1">{sorting.direction === 'asc' ? 'ascendente' : 'descendente'}</span>
                        <Button
                          color="link"
                          size="sm"
                          className="p-0 ms-2 text-danger"
                          onClick={clearSorting}
                          style={{ fontSize: '0.7rem' }}
                          title="Quitar ordenamiento"
                        >
                          <i className="mdi mdi-close"></i>
                        </Button>
                      </Badge>
                    )}
                    
                    {/* Mostrar solo filtros de columna activos (no vacíos) */}
                    {getActiveFilters().map(([column, value]) => (
                      <Badge 
                        key={column}
                        color="white" 
                        className="border border-primary me-2 mb-2 d-flex align-items-center shadow-sm"
                        style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                      >
                        <i className="mdi mdi-filter me-2 text-primary"></i>
                        <span className="fw-medium text-dark text-capitalize">{column}</span>
                        <span className="text-muted mx-1">contiene</span>
                        <span className="text-primary fw-medium">"{value}"</span>
                        <Button
                          color="link"
                          size="sm"
                          className="p-0 ms-2 text-danger"
                          onClick={() => clearColumnFilter(column)}
                          style={{ fontSize: '0.7rem' }}
                          title="Eliminar filtro"
                        >
                          <i className="mdi mdi-close"></i>
                        </Button>
                      </Badge>
                    ))}
                    
                    <Button 
                      color="link" 
                      size="sm" 
                      className="p-0 text-danger fw-medium"
                      onClick={clearAll}
                      title="Limpiar todo"
                    >
                      <i className="mdi mdi-close-circle me-1"></i>
                      Limpiar todo
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>

      {/* Vista móvil siempre cards, desktop permite selección */}
      <div className="d-md-none">
        <UserCardsView 
          usuariosFiltradosCards={usuariosFiltradosCards}
          usuarios={usuarios}
          cardSearchTerm={cardSearchTerm}
          cardSorting={cardSorting}
          onSearchChange={handleCardSearchChange}
          onSortFieldChange={handleCardSortFieldChange}
          onSortDirectionChange={handleCardSortDirectionChange}
          onClearFilters={clearCardFilters}
          getActiveCardFilters={getActiveCardFilters}
          onEditUser={manejarEditarUsuario}
          onDeleteUser={manejarEliminarUsuario}
        />
      </div>
      
      <div className="d-none d-md-block">
        {modoVista === 'cards' ? (
          <UserCardsView 
            usuariosFiltradosCards={usuariosFiltradosCards}
            usuarios={usuarios}
            cardSearchTerm={cardSearchTerm}
            cardSorting={cardSorting}
            onSearchChange={handleCardSearchChange}
            onSortFieldChange={handleCardSortFieldChange}
            onSortDirectionChange={handleCardSortDirectionChange}
            onClearFilters={clearCardFilters}
            getActiveCardFilters={getActiveCardFilters}
            onEditUser={manejarEditarUsuario}
            onDeleteUser={manejarEliminarUsuario}
          />
        ) : (
          <UserTableView 
            usuariosFiltrados={usuariosFiltrados}
            usuariosSeleccionados={usuariosSeleccionados}
            setUsuariosSeleccionados={setUsuariosSeleccionados}
            columnFilters={columnFilters}
            sorting={sorting}
            handleColumnFilter={handleColumnFilter}
            handleSort={handleSort}
            onEditUser={manejarEditarUsuario}
            onDeleteUser={manejarEliminarUsuario}
          />
        )}
      </div>

      {/* Modal para agregar/editar usuario */}
      <UserModal 
        isOpen={modalAbierto}
        toggle={toggleModal}
        esEdicion={esEdicion}
        datosFormulario={datosFormulario}
        setDatosFormulario={setDatosFormulario}
        onSave={manejarGuardarUsuario}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        show={modalEliminar}
        onDeleteClick={confirmarEliminar}
        onCloseClick={toggleDeleteModal}
      />

    </React.Fragment>
  );
};

export default UsersCrudV2;