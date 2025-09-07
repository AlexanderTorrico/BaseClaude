import React, { useMemo } from "react";
import { Card, CardBody, Input, Button, Badge } from "reactstrap";
import TableContainer from "../Common/TableContainer";
import SortableHeader from "./SortableHeader";

const AtomoTableView = ({ 
  atomosFiltrados,
  atomosSeleccionados,
  setAtomosSeleccionados,
  columnFilters,
  sorting,
  handleColumnFilter,
  handleSort,
  onEditAtomo,
  onDeleteAtomo
}) => {
  const staticHeaders = useMemo(() => ({
    simbolo: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="simbolo" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Símbolo
      </SortableHeader>
    ),
    nombre: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="nombre" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Elemento
      </SortableHeader>
    ),
    numeroAtomico: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="numeroAtomico" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Nº Atómico
      </SortableHeader>
    ),
    pesoAtomico: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="pesoAtomico" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Peso Atómico
      </SortableHeader>
    ),
    grupo: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="grupo" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Grupo
      </SortableHeader>
    ),
    periodo: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="periodo" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Periodo
      </SortableHeader>
    ),
    tipo: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="tipo" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Tipo
      </SortableHeader>
    ),
    estado: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="estado" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Estado
      </SortableHeader>
    )
  }), []);

  const obtenerBadgeTipo = (tipo) => {
    const tipoConfig = {
      metal: { color: 'primary', label: 'Metal' },
      noMetal: { color: 'danger', label: 'No Metal' },
      metaloide: { color: 'warning', label: 'Metaloide' },
      gasNoble: { color: 'info', label: 'Gas Noble' },
      transicion: { color: 'secondary', label: 'Transición' },
      alcalino: { color: 'success', label: 'Alcalino' },
      alcalinoterreo: { color: 'dark', label: 'Alcalinotérreo' }
    };
    
    const config = tipoConfig[tipo] || { color: 'light', label: tipo };
    return <Badge color={config.color}>{config.label}</Badge>;
  };

  const obtenerBadgeEstado = (estado) => {
    const estadoConfig = {
      solido: { color: 'primary', label: 'Sólido' },
      liquido: { color: 'info', label: 'Líquido' },
      gas: { color: 'warning', label: 'Gas' },
      sintetico: { color: 'secondary', label: 'Sintético' }
    };
    
    const config = estadoConfig[estado] || { color: 'light', label: estado };
    return <Badge color={config.color}>{config.label}</Badge>;
  };

  const columnas = useMemo(() => [
    {
      header: (
        <div>
          <div className="d-flex align-items-center justify-content-center">
            <Input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setAtomosSeleccionados(atomosFiltrados.map(a => a.id));
                } else {
                  setAtomosSeleccionados([]);
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
          checked={atomosSeleccionados.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setAtomosSeleccionados([...atomosSeleccionados, row.original.id]);
            } else {
              setAtomosSeleccionados(atomosSeleccionados.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
    },
    {
      header: staticHeaders.simbolo(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "simbolo",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3">
            <strong>{row.original.simbolo}</strong>
          </div>
          <div className="text-center">
            <small className="text-muted">{row.original.numeroAtomico}</small>
          </div>
        </div>
      ),
    },
    {
      header: staticHeaders.nombre(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "nombre",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div>
          <h6 className="mb-0">{row.original.nombre}</h6>
          <small className="text-muted">{row.original.configuracionElectronica}</small>
        </div>
      ),
    },
    {
      header: staticHeaders.numeroAtomico(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "numeroAtomico",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.pesoAtomico(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "pesoAtomico",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => getValue().toFixed(3),
    },
    {
      header: staticHeaders.grupo(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "grupo",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.periodo(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "periodo",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.tipo(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "tipo",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => obtenerBadgeTipo(getValue()),
    },
    {
      header: staticHeaders.estado(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "estado",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => obtenerBadgeEstado(getValue()),
    },
    {
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
          <Button
            color="primary"
            size="sm"
            onClick={() => onEditAtomo(row.original)}
            title="Editar elemento"
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => onDeleteAtomo(row.original)}
            title="Eliminar elemento"
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </div>
      ),
    },
  ], [atomosSeleccionados, atomosFiltrados, columnFilters, handleColumnFilter, sorting, handleSort, setAtomosSeleccionados, onEditAtomo, onDeleteAtomo]);

  return (
    <Card className="border-0 shadow-sm">
      <CardBody>
        <TableContainer
          columns={columnas}
          data={atomosFiltrados}
          isGlobalFilter={false}
          isPagination={true}
          isCustomPageSize={false}
          SearchPlaceholder="Filtrar elementos..."
          divClassName="table-responsive table-card mb-1"
          tableClass="align-middle table-nowrap"
          theadClass="table-light text-muted"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          pagination="pagination"
        />
      </CardBody>
    </Card>
  );
};

export default AtomoTableView;