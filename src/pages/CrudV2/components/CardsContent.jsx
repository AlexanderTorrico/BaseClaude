import React from 'react';
import PropTypes from 'prop-types';
import UserCardsViewSimple from '../../../components/CrudComponents/UserCardsViewSimple';

/**
 * Componente de contenido para vista de cards
 * Renderiza los datos en formato de tarjetas usando el CrudFacade genérico
 */
const CardsContent = ({ 
  filteredCardsData,
  data,
  cardSearchTerm,
  cardSorting,
  handleCardSearchChange,
  handleCardSortFieldChange,
  handleCardSortDirectionChange,
  clearCardFilters,
  onEditItem,
  onDeleteItem,
  cardsPerRow = 3,
  ...cardProps 
}) => {
  return (
    <UserCardsViewSimple
      usuariosFiltradosCards={filteredCardsData}
      usuarios={data}
      cardSearchTerm={cardSearchTerm}
      cardSorting={cardSorting}
      onSearchChange={handleCardSearchChange}
      onSortFieldChange={handleCardSortFieldChange}
      onSortDirectionChange={handleCardSortDirectionChange}
      onClearFilters={clearCardFilters}
      onEditUser={onEditItem}
      onDeleteUser={onDeleteItem}
      {...cardProps}
    />
  );
};

CardsContent.propTypes = {
  // Datos filtrados
  filteredCardsData: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  
  // Props de búsqueda y filtros
  cardSearchTerm: PropTypes.string.isRequired,
  cardSorting: PropTypes.object.isRequired,
  handleCardSearchChange: PropTypes.func.isRequired,
  handleCardSortFieldChange: PropTypes.func.isRequired,
  handleCardSortDirectionChange: PropTypes.func.isRequired,
  clearCardFilters: PropTypes.func.isRequired,
  
  // Callbacks para acciones
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  
  // Configuración específica de cards
  cardsPerRow: PropTypes.number
};


export default CardsContent;