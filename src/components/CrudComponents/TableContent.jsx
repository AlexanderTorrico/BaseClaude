import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Input, Button } from "reactstrap";
import TableContainer from "../Common/TableContainer";
import SortableHeader from "./SortableHeader";

/**
 * Componente de tabla genérico y reutilizable
 * Genera columnas dinámicamente basado en la configuración de fields
 */
const TableContent = ({ 
  // Datos y selección
  filteredData,
  selectedItems,
  setSelectedItems,
  
  // Filtros y ordenamiento
  columnFilters,
  sorting,
  handleColumnFilter,
  handleSort,
  
  // Configuración de campos
  fields,
  
  // Acciones
  onEditItem,
  onDeleteItem,
  
  // Configuración opcional
  showSelection = true,
  showActions = true,
  actionButtons = null, // Custom action buttons
  cellRenderers = {}, // Custom cell renderers por campo
  
  ...tableProps 
}) => {
  
  // Generar columnas dinámicamente basado en fields
  const columns = useMemo(() => {
    const cols = [];
    
    // Columna de selección (opcional)
    if (showSelection) {
      cols.push({
        header: (
          <div>
            <div className="d-flex align-items-center justify-content-center">
              <Input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(filteredData.map(item => item.id));
                  } else {
                    setSelectedItems([]);
                  }
                }}
              />
            </div>
            <div className="column-filter-container" style={{ marginTop: '8px' }}>
              <div style={{ height: '30px' }}></div>
            </div>
          </div>
        ),
        accessorKey: "select",
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Input
            type="checkbox"
            checked={selectedItems.includes(row.original.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, row.original.id]);
              } else {
                setSelectedItems(selectedItems.filter(id => id !== row.original.id));
              }
            }}
          />
        ),
      });
    }
    
    // Columnas de datos basadas en fields - filtrar y ordenar
    const tableFields = Object.entries(fields)
      .filter(([_, fieldConfig]) => fieldConfig.showInTable === true)
      .sort(([_a, configA], [_b, configB]) => {
        return (configA.tableOrder || 999) - (configB.tableOrder || 999);
      });
    
    tableFields.forEach(([fieldKey, fieldConfig]) => {
      cols.push({
          header: (
            <SortableHeader 
              column={fieldKey}
              canSort={fieldConfig.sortable !== false}
              sorting={sorting}
              onSort={handleSort}
              columnFilters={columnFilters}
              onFilterChange={handleColumnFilter}
            >
              {fieldConfig.label}
            </SortableHeader>
          ),
          accessorKey: fieldKey,
          enableSorting: false,
          enableColumnFilter: false,
          cell: ({ row, getValue }) => {
            // Si hay un renderer personalizado, usarlo
            if (cellRenderers[fieldKey]) {
              return cellRenderers[fieldKey](getValue(), row.original);
            }
            
            // Renderer por defecto basado en el tipo de campo
            const value = getValue();
            
            switch (fieldConfig.type) {
              case 'currency':
              case 'number':
                if (fieldConfig.format === 'currency') {
                  return `€${value?.toLocaleString() || 0}`;
                }
                return value?.toLocaleString() || 0;
              
              case 'email':
                return (
                  <div>
                    <div>{row.original.nombre || 'Sin nombre'}</div>
                    <small className="text-muted">{value}</small>
                  </div>
                );
              
              case 'boolean':
                return value ? 'Sí' : 'No';
                
              default:
                return value || '-';
            }
          }
        });
    });
    
    // Columna de acciones (opcional)
    if (showActions) {
      cols.push({
        header: (
          <div>
            <div className="d-flex align-items-center justify-content-between fw-medium">
              <span>Acciones</span>
            </div>
            <div className="column-filter-container" style={{ marginTop: '8px' }}>
              <div style={{ height: '30px' }}></div>
            </div>
          </div>
        ),
        accessorKey: "actions",
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            {actionButtons ? (
              actionButtons(row.original, { onEdit: onEditItem, onDelete: onDeleteItem })
            ) : (
              <>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => onEditItem(row.original)}
                >
                  <i className="mdi mdi-pencil"></i>
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => onDeleteItem(row.original)}
                >
                  <i className="mdi mdi-delete"></i>
                </Button>
              </>
            )}
          </div>
        ),
      });
    }
    
    return cols;
  }, [
    filteredData, 
    selectedItems, 
    setSelectedItems, 
    fields, 
    columnFilters, 
    handleColumnFilter, 
    sorting, 
    handleSort, 
    onEditItem, 
    onDeleteItem,
    showSelection,
    showActions,
    actionButtons,
    cellRenderers
  ]);

  return (
    <Card className="border-0 shadow-sm">
      <CardBody>
        <TableContainer
          columns={columns}
          data={filteredData}
          isGlobalFilter={false}
          isPagination={true}
          isCustomPageSize={false}
          SearchPlaceholder="Filtrar..."
          divClassName="table-responsive table-card mb-1"
          tableClass="align-middle table-nowrap"
          theadClass="table-light text-muted"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          pagination="pagination"
          {...tableProps}
        />
      </CardBody>
    </Card>
  );
};

TableContent.propTypes = {
  // Datos
  filteredData: PropTypes.array.isRequired,
  
  // Selección
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  
  // Filtros y ordenamiento
  columnFilters: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  handleColumnFilter: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  
  // Configuración de campos
  fields: PropTypes.object.isRequired,
  
  // Acciones
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  
  // Configuración opcional
  showSelection: PropTypes.bool,
  showActions: PropTypes.bool,
  actionButtons: PropTypes.func, // Function que retorna JSX para botones personalizados
  cellRenderers: PropTypes.object // Object con funciones de renderizado por campo
};

export default TableContent;