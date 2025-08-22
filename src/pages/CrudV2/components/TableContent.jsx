import React from 'react';
import PropTypes from 'prop-types';
import { CrudFacade } from '../../../components/CrudFacade';

/**
 * Componente de contenido para vista de tabla
 * Renderiza los datos en formato de tabla usando el CrudFacade genérico
 */
const TableContent = ({ 
  data, 
  fields, 
  onEdit, 
  onDelete, 
  onBulkDelete,
  selectedItems,
  onSelectionChange,
  loading = false,
  ...tableProps 
}) => {
  return (
    <CrudFacade.Table
      data={data}
      fields={fields}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      loading={loading}
      {...tableProps}
    />
  );
};

TableContent.propTypes = {
  // Datos a mostrar en la tabla
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
  
  // Props adicionales para el componente de tabla
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number
};

TableContent.defaultProps = {
  selectedItems: [],
  sortable: true,
  filterable: true,
  pagination: true,
  pageSize: 10
};

export default TableContent;