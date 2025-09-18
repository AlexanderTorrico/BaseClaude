import React from "react";
import { Row, Col, Button } from "reactstrap";
import UserCard from "./UserCard";

const MobileCardsView = ({ 
  usuariosFiltrados,
  usuarios,
  cardSearchTerm,
  cardSorting,
  handleCardSearchChange,
  handleCardSortFieldChange,
  handleCardSortDirectionChange,
  clearCardFilters,
  getActiveCardFilters,
  onEditUser,
  onDeleteUser,
  // Props para acciones
  onAddUser,
  onBulkDelete,
  selectedUsers,
  onViewModeChange,
  currentViewMode
}) => {
  return (
    <Row>
      {usuariosFiltrados.map(usuario => (
        <Col xs={12} sm={6} key={usuario.id} className="mb-3">
          <UserCard 
            usuario={usuario}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
          />
        </Col>
      ))}
      
      {usuariosFiltrados.length === 0 && (
        <Col xs={12}>
          <div className="text-center py-5">
            <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
              <i className="mdi mdi-account-search mdi-36px text-muted"></i>
            </div>
            <h5 className="mb-3">No se encontraron usuarios</h5>
            <p className="text-muted mb-4">
              No hay usuarios que coincidan con los criterios de búsqueda aplicados.
            </p>
            <Button 
              color="primary" 
              outline 
              onClick={clearCardFilters}
              className="d-inline-flex align-items-center"
            >
              <i className="mdi mdi-filter-remove me-2"></i>
              Limpiar filtros
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default MobileCardsView;

