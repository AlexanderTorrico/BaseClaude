import React from "react";
import { Badge, ButtonGroup, Button } from "reactstrap";
import { AzTableColumns } from "../../../../../../components/aziende/AzTable";

/**
 * Configuración de columnas para la tabla de productos
 * Centraliza la definición de todas las columnas y sus comportamientos
 */

export const getProductTableColumns = ({ onEdit, onDelete, isUpdating, isDeleting }) => [
  {
    key: "name",
    header: "Producto",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: AzTableColumns.Text({ className: "fw-medium" })
  },
  {
    key: "category",
    header: "Categoría",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: ["Electrónicos", "Ropa", "Hogar", "Deportes", "Libros"],
    cell: AzTableColumns.Text({ className: "text-muted" })
  },
  {
    key: "price",
    header: "Precio",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: AzTableColumns.Currency({
      locale: "es-ES",
      currency: "USD",
      className: "fw-bold text-success"
    })
  },
  {
    key: "stock",
    header: "Stock",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ value }) => {
      const getStockStatus = (stock) => {
        if (stock > 50) return { color: 'success', text: 'En Stock' };
        if (stock > 10) return { color: 'warning', text: 'Poco Stock' };
        return { color: 'danger', text: 'Sin Stock' };
      };

      const status = getStockStatus(value);

      return (
        <div>
          <span className="fw-medium">{value} unidades</span>
          <br />
          <Badge color={status.color} className="mt-1">
            {status.text}
          </Badge>
        </div>
      );
    }
  },
  {
    key: "createdAt",
    header: "Fecha Creación",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: AzTableColumns.Date({ locale: "es-ES", showTime: false })
  },
  {
    key: "actions",
    header: "Acciones",
    sortable: false,
    filterable: false,
    cell: ({ row }) => (
      <ButtonGroup size="sm">
        <Button
          color="primary"
          onClick={() => onEdit?.(row)}
          disabled={isUpdating || isDeleting}
          title="Editar producto"
        >
          <i className="mdi mdi-pencil"></i>
        </Button>
        <Button
          color="danger"
          onClick={() => onDelete?.(row.id)}
          disabled={isDeleting || isUpdating}
          title="Eliminar producto"
        >
          <i className="mdi mdi-delete"></i>
        </Button>
      </ButtonGroup>
    )
  }
];

/**
 * Configuración de filtros para obtener las opciones dinámicamente
 */
export const getFilterOptions = () => ({
  categories: ["Electrónicos", "Ropa", "Hogar", "Deportes", "Libros"],
  sortFields: [
    { value: "name", label: "Nombre" },
    { value: "price", label: "Precio" },
    { value: "stock", label: "Stock" },
    { value: "createdAt", label: "Fecha" }
  ]
});

/**
 * Configuración de columnas simplificada para filtros
 * Solo incluye las columnas que se pueden filtrar
 */
export const getFilterableColumns = () => [
  {
    key: "name",
    header: "Nombre",
    filterType: "text"
  },
  {
    key: "category",
    header: "Categoría",
    filterType: "select",
    filterOptions: getFilterOptions().categories
  },
  {
    key: "price",
    header: "Precio",
    filterType: "text"
  },
  {
    key: "stock",
    header: "Stock",
    filterType: "text"
  }
];