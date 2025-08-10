import React, { useMemo } from "react";
import { Card, CardBody, Input, Button } from "reactstrap";
import TableContainer from "../../../components/Common/TableContainer";
import SortableHeader from "./SortableHeader";
import { obtenerBadgeEstado } from "../utils/userHelpers.jsx";

const UserTableView = ({ 
  usuariosFiltrados,
  usuariosSeleccionados,
  setUsuariosSeleccionados,
  columnFilters,
  sorting,
  handleColumnFilter,
  handleSort,
  onEditUser,
  onDeleteUser
}) => {
  const staticHeaders = useMemo(() => ({
    nombre: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="nombre" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Usuario
      </SortableHeader>
    ),
    rol: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="rol" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Rol
      </SortableHeader>
    ),
    departamento: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="departamento" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Departamento
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
    ),
    telefono: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="telefono" 
        canSort={false} 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Teléfono
      </SortableHeader>
    ),
    salario: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="salario" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Salario
      </SortableHeader>
    )
  }), []);

  const columnas = useMemo(() => [
    {
      header: (
        <Input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setUsuariosSeleccionados(usuariosFiltrados.map(u => u.id));
            } else {
              setUsuariosSeleccionados([]);
            }
          }}
        />
      ),
      accessorKey: "select",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Input
          type="checkbox"
          checked={usuariosSeleccionados.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setUsuariosSeleccionados([...usuariosSeleccionados, row.original.id]);
            } else {
              setUsuariosSeleccionados(usuariosSeleccionados.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
    },
    {
      header: staticHeaders.nombre(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "nombre",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="avatar-xs rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3">
            {row.original.nombre.charAt(0)}
          </div>
          <div>
            <h6 className="mb-0">{row.original.nombre}</h6>
            <p className="text-muted mb-0 small">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: staticHeaders.rol(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "rol",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.departamento(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "departamento",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.estado(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "estado",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => obtenerBadgeEstado(getValue()),
    },
    {
      header: staticHeaders.telefono(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "telefono",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.salario(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "salario",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => `€${getValue().toLocaleString()}`,
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            color="primary"
            size="sm"
            onClick={() => onEditUser(row.original)}
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => onDeleteUser(row.original)}
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </div>
      ),
    },
  ], [usuariosSeleccionados, usuariosFiltrados, columnFilters, handleColumnFilter, sorting, handleSort, staticHeaders, setUsuariosSeleccionados, onEditUser, onDeleteUser]);

  return (
    <Card className="border-0 shadow-sm">
      <CardBody>
        <TableContainer
          columns={columnas}
          data={usuariosFiltrados}
          isGlobalFilter={false}
          isPagination={true}
          isCustomPageSize={false}
          SearchPlaceholder="Filtrar..."
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

export default UserTableView;