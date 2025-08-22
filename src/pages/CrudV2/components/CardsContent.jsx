import React from 'react';
import PropTypes from 'prop-types';
import { CrudFacade } from '../../../components/CrudFacade';

/**
 * Componente de contenido para vista de cards
 * Renderiza los datos en formato de tarjetas usando el CrudFacade genérico
 */
const CardsContent = ({ 
  data, 
  fields, 
  onEdit, 
  onDelete, 
  onBulkDelete,
  selectedItems,
  onSelectionChange,
  loading = false,
  cardsPerRow = 3,
  showSelection = true,
  ...cardProps 
}) => {
  return (
    <CrudFacade.Cards
      data={data}
      fields={fields}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      loading={loading}
      cardsPerRow={cardsPerRow}
      showSelection={showSelection}
      {...cardProps}
    />
  );
};

CardsContent.propTypes = {
  // Datos a mostrar en las cards
  data: PropTypes.array.isRequired,
  
  // Configuración de campos (schema)
  fields: PropTypes.object.isRequired,
  
  // Callbacks para acciones
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onBulkDelete: PropTypes.func,
  
  // Selección múltiple
  selectedItems: PropTypes.array,
  onSelectionChange: PropTypes.func,
  
  // Estados
  loading: PropTypes.bool,
  
  // Configuración específica de cards
  cardsPerRow: PropTypes.number,
  showSelection: PropTypes.bool,
  
  // Props adicionales para el componente de cards
  cardSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  showImages: PropTypes.bool,
  showActions: PropTypes.bool
};

CardsContent.defaultProps = {
  selectedItems: [],
  cardsPerRow: 3,
  showSelection: true,
  cardSize: 'md',
  showImages: true,
  showActions: true
};

export default CardsContent;