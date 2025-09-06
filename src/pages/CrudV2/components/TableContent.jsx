import React from 'react';
import PropTypes from 'prop-types';
import UserTableView from '../../../components/CrudComponents/UserTableView';

/**
 * Componente de contenido para vista de tabla
 * Renderiza los datos en formato de tabla usando el CrudFacade genérico
 */
const TableContent = ({ 
  filteredData,
  unifiedFilteredData,
  selectedItems,
  setSelectedItems,
  columnFilters,
  sorting,
  handleColumnFilter,
  handleColumnFilterUnified,
  handleSort,
  handleSortUnified,
  onEditItem,
  onDeleteItem,
  ...tableProps 
}) => {
  return (
    <UserTableView
      usuariosFiltrados={unifiedFilteredData || filteredData}
      usuariosSeleccionados={selectedItems}
      setUsuariosSeleccionados={setSelectedItems}
      columnFilters={columnFilters}
      sorting={sorting}
      handleColumnFilter={handleColumnFilterUnified || handleColumnFilter}
      handleSort={handleSortUnified || handleSort}
      onEditUser={onEditItem}
      onDeleteUser={onDeleteItem}
      {...tableProps}
    />
  );
};

TableContent.propTypes = {
  // Datos filtrados
  filteredData: PropTypes.array.isRequired,
  unifiedFilteredData: PropTypes.array,
  
  // Selección múltiple
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  
  // Filtros y ordenamiento
  columnFilters: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  handleColumnFilter: PropTypes.func.isRequired,
  handleColumnFilterUnified: PropTypes.func,
  handleSort: PropTypes.func.isRequired,
  handleSortUnified: PropTypes.func,
  
  // Callbacks para acciones
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};


export default TableContent;