import React from "react";
import { Row, Col, Button } from "reactstrap";
import MobileCardSearchPanel from "./MobileCardSearchPanel";
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
  onDeleteUser
}) => {
  return (
    <>
      <MobileCardSearchPanel 
        usuariosFiltrados={usuariosFiltrados}
        usuarios={usuarios}
        cardSearchTerm={cardSearchTerm}
        cardSorting={cardSorting}
        handleCardSearchChange={handleCardSearchChange}
        handleCardSortFieldChange={handleCardSortFieldChange}
        handleCardSortDirectionChange={handleCardSortDirectionChange}
        clearCardFilters={clearCardFilters}
        getActiveCardFilters={getActiveCardFilters}
      />
      
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
    </>
  );
};

export default MobileCardsView;