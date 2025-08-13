import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Button, Card, CardBody } from "reactstrap";
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
    <Card className="border-0 shadow-sm">
      <CardBody>
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
            <div className="text-center py-4">
              <div className="avatar-lg rounded-circle bg-light mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i className="mdi mdi-account-search mdi-36px text-muted"></i>
              </div>
              <h6 className="mb-2">No se encontraron usuarios</h6>
              <p className="text-muted mb-3 small">
                No hay usuarios que coincidan con los criterios de búsqueda aplicados.
              </p>
              <Button 
                color="primary" 
                outline 
                size="sm"
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
      </CardBody>
    </Card>
  );
};

MobileCardsView.propTypes = {
  usuariosFiltrados: PropTypes.array.isRequired,
  usuarios: PropTypes.array.isRequired,
  cardSearchTerm: PropTypes.string.isRequired,
  cardSorting: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  handleCardSearchChange: PropTypes.func.isRequired,
  handleCardSortFieldChange: PropTypes.func.isRequired,
  handleCardSortDirectionChange: PropTypes.func.isRequired,
  clearCardFilters: PropTypes.func.isRequired,
  getActiveCardFilters: PropTypes.func.isRequired,
  onEditUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  // Props para acciones
  onAddUser: PropTypes.func.isRequired,
  onBulkDelete: PropTypes.func,
  selectedUsers: PropTypes.array,
  onViewModeChange: PropTypes.func.isRequired,
  currentViewMode: PropTypes.string.isRequired,
};

export default MobileCardsView;