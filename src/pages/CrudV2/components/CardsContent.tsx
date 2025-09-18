import React from 'react';
import UserCardsViewSimple from '../../../components/CrudComponents/UserCardsViewSimple';

/**
 * Componente de contenido para vista de cards
 * Renderiza los datos en formato de tarjetas usando el CrudFacade genérico
 */
interface CardsContentProps {
  filteredCardsData: any[];
  unifiedFilteredData: any[];
  data: any[];
  cardSearchTerm: string;
  cardSorting: Record<string, any>;
  handleCardSearchChange: (term: string) => void;
  handleCardSortFieldChange: (field: string) => void;
  handleCardSortDirectionChange: (direction: string) => void;
  clearCardFilters: () => void;
  onEditItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
  onViewItem: (item: any) => void;
  entity: string;
  fields: any[];
  config: any;
}

const CardsContent: React.FC<CardsContentProps> = ({ 
  filteredCardsData,
  unifiedFilteredData,
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
      usuariosFiltradosCards={unifiedFilteredData || filteredCardsData}
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



export default CardsContent;