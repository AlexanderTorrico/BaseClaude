import React from "react";
import { Row, Col, Button } from "reactstrap";
import CardSearchPanel from "./CardSearchPanel";
import UserCard from "./UserCard";

const UserCardsView = ({ 
  usuariosFiltradosCards,
  usuarios,
  cardSearchTerm,
  cardSorting,
  onSearchChange,
  onSortFieldChange,
  onSortDirectionChange,
  onClearFilters,
  onEditUser,
  onDeleteUser
}) => {
  return (
    <>
      <CardSearchPanel 
        cardSearchTerm={cardSearchTerm}
        cardSorting={cardSorting}
        usuariosFiltradosCards={usuariosFiltradosCards}
        usuarios={usuarios}
        onSearchChange={onSearchChange}
        onSortFieldChange={onSortFieldChange}
        onSortDirectionChange={onSortDirectionChange}
        onClearFilters={onClearFilters}
      />
      
      <Row>
        {usuariosFiltradosCards.map(usuario => (
          <Col xl={4} lg={6} md={6} sm={12} key={usuario.id} className="mb-4">
            <UserCard 
              usuario={usuario}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
            />
          </Col>
        ))}
        
        {usuariosFiltradosCards.length === 0 && (
          <Col xs={12}>
            <div className="text-center py-5">
              <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
                <i className="mdi mdi-account-search mdi-36px text-muted"></i>
              </div>
              <h5 className="mb-3">No se encontraron usuarios</h5>
              <p className="text-muted mb-4">
                No hay usuarios que coincidan con los criterios de búsqueda y filtros aplicados.
              </p>
              <Button 
                color="primary" 
                outline 
                onClick={onClearFilters}
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

export default UserCardsView;