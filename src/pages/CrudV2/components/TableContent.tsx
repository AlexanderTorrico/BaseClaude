import React from 'react';
import UserTableView from '../../../components/CrudComponents/UserTableView';

/**
 * Componente de contenido para vista de tabla
 * Renderiza los datos en formato de tabla usando el CrudFacade genérico
 */
interface TableContentProps {
  filteredData: any[];
  unifiedFilteredData: any[];
  selectedItems: any[];
  setSelectedItems: (items: any[]) => void;
  columnFilters: Record<string, any>;
  sorting: Record<string, any>;
  handleColumnFilter: (column: string, value: any) => void;
  handleColumnFilterUnified: (column: string, value: any) => void;
  handleSort: (column: string) => void;
  handleSortUnified: (column: string) => void;
  onEditItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
  onViewItem: (item: any) => void;
  entity: string;
  fields: any[];
  config: any;
}

const TableContent: React.FC<TableContentProps> = ({ 
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



export default TableContent;