import React from "react";
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
import DeleteModal from "../../components/Common/DeleteModal";
import UserCardsView from "./components/UserCardsView";
import UserTableView from "./components/UserTableView";
import MobileCardsView from "./components/MobileCardsView";
import UserModal from "./components/UserModal";
import FilterInfoPanel from "./components/FilterInfoPanel";
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
      {/* Card de título solo visible en vista table */}
      {modoVista === 'table' && (
        <Card className="border-0 shadow-sm mb-4">
          <CardBody>
            <Row className="align-items-center">
              <Col lg={6} md={12}>
                <h4 className="mb-0">Gestión de Usuarios V2</h4>
                <p className="text-muted mb-md-0 mb-3">
                  Sistema moderno de administración de usuarios con filtros avanzados
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

            {/* Resumen de filtros y ordenamiento activos usando FilterInfoPanel */}
            <FilterInfoPanel
              filters={getActiveFilters().map(([column, value]) => ({
                column,
                value,
                type: 'column'
              }))}
              sorting={sorting.column && sorting.direction ? {
                column: sorting.column,
                direction: sorting.direction,
                isActive: true
              } : null}
              onClearFilter={(filter) => clearColumnFilter(filter.column)}
              onClearSorting={clearSorting}
              onClearAll={clearAll}
              totalResults={usuariosFiltrados.length}
              totalItems={usuarios.length}
              isIntegrated={true}
              className="mt-3"
            />
          </CardBody>
        </Card>
      )}

      
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
            onEditUser={manejarEditarUsuario}
            onDeleteUser={manejarEliminarUsuario}
            onAddUser={manejarAgregarUsuario}
            onBulkDelete={manejarEliminarMasivo}
            selectedUsers={usuariosSeleccionados}
            onViewModeChange={setModoVista}
            currentViewMode={modoVista}
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

      {/* Vista móvil - Siempre usa cards */}
      <div className="d-md-none">
        <MobileCardsView 
          usuariosFiltrados={usuariosFiltradosCards}
          usuarios={usuarios}
          cardSearchTerm={cardSearchTerm}
          cardSorting={cardSorting}
          handleCardSearchChange={handleCardSearchChange}
          handleCardSortFieldChange={handleCardSortFieldChange}
          handleCardSortDirectionChange={handleCardSortDirectionChange}
          clearCardFilters={clearCardFilters}
          getActiveCardFilters={getActiveCardFilters}
          onEditUser={manejarEditarUsuario}
          onDeleteUser={manejarEliminarUsuario}
          onAddUser={manejarAgregarUsuario}
          onBulkDelete={manejarEliminarMasivo}
          selectedUsers={usuariosSeleccionados}
          onViewModeChange={setModoVista}
          currentViewMode={modoVista}
        />
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