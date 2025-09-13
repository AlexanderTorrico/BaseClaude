import React, { useMemo, useState, useEffect, Children } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Input, Badge as BootstrapBadge, Button } from "reactstrap";
import { Link as RouterLink } from "react-router-dom";
import TableContainer from "../../../../components/Common/TableContainer";

/**
 * AzTable - Componente genérico de tabla con funcionalidades avanzadas
 *
 * PROPS PRINCIPALES:
 * @param {Array} data - Array de objetos con los datos a mostrar (Requerido)
 * @param {Array} columns - Configuración de columnas (Requerido)
 *   Estructura de cada columna:
 *   {
 *     key: "campo",              // Campo del objeto data (Requerido)
 *     header: "Título Columna",  // Título mostrado en header
 *     sortable: true,            // Permite ordenamiento
 *     filterable: true,          // Permite filtrado
 *     cell: function,            // Función custom para renderizar celda
 *     width: "100px"             // Ancho de columna
 *   }
 *
 * FUNCIONALIDADES:
 * @param {Array} selectedItems - Array de IDs seleccionados [1, 2, 3]
 * @param {Function} onSelectedChange - Callback cuando cambia selección
 * @param {Boolean} pagination - Activar/desactivar paginación (default: true)
 * @param {Object} sorting - Estado actual del ordenamiento
 *   { field: "nombre", direction: "asc|desc|" }
 * @param {Function} onSortChange - Callback cuando cambia ordenamiento
 * @param {Object} filters - Estado actual de filtros { columna: "valor" }
 * @param {Function} onFilterChange - Callback cuando cambia filtro
 *
 * ESTILOS:
 * @param {String} className - Clases CSS adicionales para el Card
 * @param {Object} tableProps - Props adicionales para TableContainer
 *
 * CHILDREN:
 * @param {Node} children - Componente AzTable.Actions para botones de acción
 *
 * EJEMPLO DE USO:
 *
 * const columns = [
 *   {
 *     key: "nombre",
 *     header: "Usuario",
 *     sortable: true,
 *     filterable: true,
 *     cell: AzTable.Column.Avatar({
 *       nameField: "nombre",
 *       emailField: "email"
 *     })
 *   },
 *   {
 *     key: "estado",
 *     header: "Estado",
 *     cell: AzTable.Column.Badge({
 *       colorMap: { "Activo": "success", "Inactivo": "danger" }
 *     })
 *   }
 * ];
 *
 * <AzTable
 *   data={usuarios}
 *   columns={columns}
 *   selectedItems={seleccionados}
 *   onSelectedChange={setSeleccionados}
 *   pagination={true}
 *   sorting={sorting}
 *   onSortChange={handleSort}
 *   filters={filtros}
 *   onFilterChange={handleFilter}
 * >
 *   <AzTable.Actions>
 *     <Button color="primary" onClick={onEdit}>
 *       <i className="mdi mdi-pencil"></i>
 *     </Button>
 *   </AzTable.Actions>
 * </AzTable>
 */
const AzTable = ({
  data = [],
  columns = [],
  selectedItems = [],
  onSelectedChange,
  pagination = true,
  sorting = { field: "", direction: "" },
  onSortChange,
  filters = {},
  onFilterChange,
  className = "",
  tableProps = {},
  children
}) => {
  // Usar directamente selectedItems sin estado interno para evitar loops
  const currentSelectedItems = selectedItems || [];

  const handleSelectionChange = (newSelectedItems) => {
    if (onSelectedChange) {
      onSelectedChange(newSelectedItems);
    }
  };

  const actionColumn = useMemo(() => {
    const actionsChild = Children.toArray(children).find(
      child => child.type?.displayName === 'AzTableActions'
    );

    if (!actionsChild) return null;

    return {
      header: (
        <div>
          <div className="d-flex align-items-center justify-content-center fw-medium">
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
      cell: ({ row }) => {
        const actionsProps = {
          row: row.original,
          index: row.index,
          isSelected: currentSelectedItems.includes(row.original.id),
          ...actionsChild.props
        };
        return React.cloneElement(actionsChild, actionsProps);
      }
    };
  }, [children, currentSelectedItems]);

  const processedColumns = useMemo(() => {
    let finalColumns = [];

    // Add selection column if onSelectedChange is provided
    if (onSelectedChange) {
      const selectionColumn = {
        header: (
          <div>
            <div className="d-flex align-items-center justify-content-center">
              <Input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleSelectionChange(data.map(item => item.id));
                  } else {
                    handleSelectionChange([]);
                  }
                }}
                checked={data.length > 0 && currentSelectedItems.length === data.length}
                indeterminate={currentSelectedItems.length > 0 && currentSelectedItems.length < data.length}
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
            checked={currentSelectedItems.includes(row.original.id)}
            onChange={(e) => {
              if (e.target.checked) {
                handleSelectionChange([...currentSelectedItems, row.original.id]);
              } else {
                handleSelectionChange(currentSelectedItems.filter(id => id !== row.original.id));
              }
            }}
          />
        ),
      };
      finalColumns.push(selectionColumn);
    }

    // Process user-defined columns
    const processedUserColumns = columns.map(column => {
      const processedColumn = {
        accessorKey: column.key,
        enableSorting: false,
        enableColumnFilter: false,
        ...column
      };

      // Create header with sorting and filtering
      if (column.header || column.sortable || column.filterable) {
        processedColumn.header = (
          <AzTableHeader
            column={column.key}
            title={column.header || column.key}
            sortable={column.sortable}
            filterable={column.filterable}
            sorting={sorting}
            filters={filters}
            onSort={onSortChange}
            onFilter={onFilterChange}
          />
        );
      }

      return processedColumn;
    });

    finalColumns = [...finalColumns, ...processedUserColumns];

    // Add actions column if exists
    if (actionColumn) {
      finalColumns.push(actionColumn);
    }

    return finalColumns;
  }, [columns, data, currentSelectedItems, onSelectedChange, actionColumn, sorting, filters, onSortChange, onFilterChange]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card className={`border-0 shadow-sm ${className}`}>
            <CardBody className="p-4">
              <div className="table-responsive">
                <TableContainer
                  columns={processedColumns}
                  data={data}
                  isGlobalFilter={false}
                  isPagination={pagination}
                  isCustomPageSize={false}
                  SearchPlaceholder="Filtrar..."
                  divClassName="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap table-striped"
                  theadClass="table-light text-muted"
                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded mt-3"
                  pagination="pagination"
                  {...tableProps}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente de header con ordenamiento y filtrado
 */
const AzTableHeader = ({
  column,
  title,
  sortable = false,
  filterable = false,
  sorting = { field: "", direction: "" },
  filters = {},
  onSort,
  onFilter
}) => {
  const currentSortDirection = sorting.field === column ? sorting.direction : "";
  const currentFilter = filters[column] || "";

  const handleSort = () => {
    if (!sortable || !onSort) return;

    let newDirection = "asc";
    if (currentSortDirection === "asc") {
      newDirection = "desc";
    } else if (currentSortDirection === "desc") {
      newDirection = "";
    }

    onSort({
      field: newDirection ? column : "",
      direction: newDirection
    });
  };

  const handleFilter = (e) => {
    if (!filterable || !onFilter) return;
    onFilter(column, e.target.value);
  };

  const getSortIcon = () => {
    if (!sortable) return null;

    if (currentSortDirection === "asc") {
      return <i className="mdi mdi-arrow-up text-primary ms-1"></i>;
    } else if (currentSortDirection === "desc") {
      return <i className="mdi mdi-arrow-down text-primary ms-1"></i>;
    }
    return <i className="mdi mdi-unfold-more-horizontal text-muted ms-1"></i>;
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between fw-medium">
        <span
          className={`${sortable ? 'cursor-pointer user-select-none' : ''}`}
          onClick={handleSort}
          style={{
            cursor: sortable ? 'pointer' : 'default',
            userSelect: 'none'
          }}
        >
          {title}
          {getSortIcon()}
        </span>
      </div>
      {filterable && (
        <div className="column-filter-container" style={{ marginTop: '8px' }}>
          <Input
            type="text"
            bsSize="sm"
            placeholder={`Filtrar ${title}...`}
            value={currentFilter}
            onChange={handleFilter}
            style={{ fontSize: '12px', height: '30px' }}
          />
        </div>
      )}
      {!filterable && (
        <div className="column-filter-container" style={{ marginTop: '8px' }}>
          <div style={{ height: '30px' }}></div>
        </div>
      )}
    </div>
  );
};

/**
 * Componente de acciones personalizable
 * Los botones reciben automáticamente las props: data-row, data-index, data-selected
 *
 * EJEMPLO:
 * <AzTable.Actions>
 *   <Button
 *     color="primary"
 *     onClick={(e) => {
 *       const row = JSON.parse(e.target.getAttribute('data-row'));
 *       editUser(row);
 *     }}
 *   >
 *     Editar
 *   </Button>
 * </AzTable.Actions>
 */
const AzTableActions = ({ children, row, index, isSelected, ...props }) => {
  const processedChildren = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        'data-row': JSON.stringify(row),
        'data-index': index,
        'data-selected': isSelected,
        ...props
      });
    }
    return child;
  });

  return <div className="d-flex gap-2 py-2 justify-content-center">{processedChildren}</div>;
};

AzTableActions.displayName = 'AzTableActions';

// ========================================
// TIPOS DE COLUMNA PERSONALIZADOS
// ========================================

/**
 * AVATAR - Muestra avatar con nombre y email opcional
 * @param {String} nameField - Campo que contiene el nombre
 * @param {String} emailField - Campo que contiene el email (opcional)
 * @param {String} avatarField - Campo que contiene URL del avatar (opcional)
 * @param {String} size - Tamaño del avatar: xs, sm, md, lg (default: xs)
 * @param {String} bgColor - Color de fondo: primary, secondary, etc (default: primary)
 */
const Avatar = ({ nameField, emailField, avatarField, size = "xs", bgColor = "primary" }) => {
  return ({ row }) => {
    const name = row.original[nameField] || "";
    const email = emailField ? row.original[emailField] : null;
    const avatar = avatarField ? row.original[avatarField] : null;

    return (
      <div className="d-flex align-items-center py-2">
        <div className={`avatar-${size} rounded-circle bg-${bgColor} text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0`}>
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="rounded-circle"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-1 text-truncate" style={{ maxWidth: '200px' }}>{name}</h6>
          {email && <p className="text-muted mb-0 small text-truncate" style={{ maxWidth: '200px' }}>{email}</p>}
        </div>
      </div>
    );
  };
};

/**
 * BADGE - Muestra badges de estado con colores
 * @param {Object} colorMap - Mapeo de valores a colores: { "Activo": "success", "Inactivo": "danger" }
 * @param {String} defaultColor - Color por defecto (default: secondary)
 * @param {Boolean} pill - Badge estilo pill (default: true)
 * @param {String} className - Clases CSS adicionales
 */
const Badge = ({ colorMap = {}, defaultColor = "secondary", pill = true, className = "" }) => {
  return ({ getValue }) => {
    const value = getValue();
    const color = colorMap[value] || defaultColor;

    return (
      <div className="py-2">
        <BootstrapBadge color={color} pill={pill} className={`${className} px-3 py-2`}>
          {value}
        </BootstrapBadge>
      </div>
    );
  };
};

/**
 * CURRENCY - Formatea valores como moneda
 * @param {String} symbol - Símbolo de moneda (default: €)
 * @param {String} locale - Localización (default: es-ES)
 * @param {String} currency - Código de moneda (default: EUR)
 * @param {Number} minimumFractionDigits - Decimales mínimos (default: 0)
 * @param {Number} maximumFractionDigits - Decimales máximos (default: 2)
 * @param {String} className - Clases CSS adicionales
 */
const Currency = ({
  symbol = "€",
  locale = "es-ES",
  currency = "EUR",
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  className = ""
}) => {
  return ({ getValue }) => {
    const value = getValue();

    if (value == null || isNaN(value)) {
      return <span className={className}>-</span>;
    }

    const formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);

    return (
      <div className="py-2">
        <span className={`${className} fw-semibold text-success`}>{formattedValue}</span>
      </div>
    );
  };
};

/**
 * DATE - Formatea fechas
 * @param {String} format - Formato de fecha (default: DD/MM/YYYY)
 * @param {String} locale - Localización (default: es-ES)
 * @param {Boolean} showTime - Mostrar hora (default: false)
 * @param {String} timeFormat - Formato de hora (default: HH:mm)
 * @param {String} className - Clases CSS adicionales
 */
const DateColumn = ({
  format = "DD/MM/YYYY",
  locale = "es-ES",
  showTime = false,
  timeFormat = "HH:mm",
  className = ""
}) => {
  return ({ getValue }) => {
    const value = getValue();

    if (!value) {
      return <span className={className}>-</span>;
    }

    try {
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return <span className={className}>-</span>;
      }

      let options = {};

      if (showTime) {
        options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        };
      } else {
        options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        };
      }

      const formattedDate = date.toLocaleDateString(locale, options);

      return <span className={className}>{formattedDate}</span>;
    } catch (error) {
      return <span className={className}>-</span>;
    }
  };
};

/**
 * BOOLEAN - Muestra valores booleanos con iconos
 * @param {String} trueText - Texto para true (default: Sí)
 * @param {String} falseText - Texto para false (default: No)
 * @param {String} trueColor - Color para true (default: success)
 * @param {String} falseColor - Color para false (default: danger)
 * @param {Boolean} showIcon - Mostrar iconos (default: true)
 * @param {String} trueIcon - Icono para true (default: mdi-check-circle)
 * @param {String} falseIcon - Icono para false (default: mdi-close-circle)
 * @param {String} className - Clases CSS adicionales
 */
const BooleanColumn = ({
  trueText = "Sí",
  falseText = "No",
  trueColor = "success",
  falseColor = "danger",
  showIcon = true,
  trueIcon = "mdi-check-circle",
  falseIcon = "mdi-close-circle",
  className = ""
}) => {
  return ({ getValue }) => {
    const value = Boolean(getValue());
    const text = value ? trueText : falseText;
    const color = value ? trueColor : falseColor;
    const icon = value ? trueIcon : falseIcon;

    return (
      <span className={`text-${color} ${className}`}>
        {showIcon && <i className={`mdi ${icon} me-1`}></i>}
        {text}
      </span>
    );
  };
};

/**
 * TEXT - Renderizado de texto con opciones
 * @param {Number} maxLength - Longitud máxima antes de truncar
 * @param {String} transform - Transformación: uppercase, lowercase, capitalize
 * @param {String} className - Clases CSS adicionales
 * @param {Boolean} showTooltip - Mostrar tooltip en texto truncado
 */
const Text = ({ maxLength = null, transform = null, className = "", showTooltip = false }) => {
  return ({ getValue }) => {
    let value = getValue() || "";

    if (transform === "uppercase") {
      value = value.toString().toUpperCase();
    } else if (transform === "lowercase") {
      value = value.toString().toLowerCase();
    } else if (transform === "capitalize") {
      value = value.toString().charAt(0).toUpperCase() + value.toString().slice(1).toLowerCase();
    }

    const displayValue = maxLength && value.length > maxLength
      ? `${value.substring(0, maxLength)}...`
      : value;

    const shouldShowTooltip = showTooltip && maxLength && value.length > maxLength;

    return (
      <span className={className} title={shouldShowTooltip ? value : undefined}>
        {displayValue}
      </span>
    );
  };
};

/**
 * LINK - Enlaces externos o internos
 * @param {String} hrefField - Campo que contiene la URL
 * @param {String} href - URL fija
 * @param {String} target - Target del enlace (default: _self)
 * @param {String} className - Clases CSS adicionales
 * @param {Boolean} isRouterLink - Usar React Router Link (default: false)
 */
const Link = ({
  hrefField = null,
  href = null,
  target = "_self",
  className = "text-primary",
  isRouterLink = false
}) => {
  return ({ getValue, row }) => {
    const displayValue = getValue() || "";
    const linkHref = hrefField ? row.original[hrefField] : href;

    if (!linkHref) {
      return <span className={className}>{displayValue}</span>;
    }

    if (isRouterLink) {
      return (
        <RouterLink to={linkHref} className={className}>
          {displayValue}
        </RouterLink>
      );
    }

    return (
      <a
        href={linkHref}
        target={target}
        className={className}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {displayValue}
      </a>
    );
  };
};

/**
 * NUMBER - Formatea números
 * @param {String} locale - Localización (default: es-ES)
 * @param {Number} minimumFractionDigits - Decimales mínimos (default: 0)
 * @param {Number} maximumFractionDigits - Decimales máximos (default: 2)
 * @param {String} prefix - Prefijo (ej: "#")
 * @param {String} suffix - Sufijo (ej: " años")
 * @param {String} className - Clases CSS adicionales
 */
const NumberColumn = ({
  locale = "es-ES",
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  prefix = "",
  suffix = "",
  className = ""
}) => {
  return ({ getValue }) => {
    const value = getValue();

    if (value == null || isNaN(value)) {
      return <span className={className}>-</span>;
    }

    const formattedValue = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);

    return (
      <span className={className}>
        {prefix}{formattedValue}{suffix}
      </span>
    );
  };
};

/**
 * CUSTOM - Renderizador completamente personalizado
 * @param {Function|Component} component - Función o componente personalizado
 */
const Custom = (component) => {
  if (typeof component === 'function') {
    return component;
  }
  return ({ getValue, row }) => {
    return React.isValidElement(component)
      ? React.cloneElement(component, { value: getValue(), row: row.original })
      : component;
  };
};

// ========================================
// EXPORTACIÓN Y CONFIGURACIÓN
// ========================================

// Configuración de tipos de columna
const AzTableColumn = {
  Avatar,
  Badge,
  Currency,
  Date: DateColumn,
  Number: NumberColumn,
  Text,
  Link,
  Boolean: BooleanColumn,
  Custom
};

// Asignar subcomponentes
AzTable.Actions = AzTableActions;
AzTable.Column = AzTableColumn;

// PropTypes
AzTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.string,
    sortable: PropTypes.bool,
    filterable: PropTypes.bool,
    cell: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  selectedItems: PropTypes.array,
  onSelectedChange: PropTypes.func,
  pagination: PropTypes.bool,
  sorting: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc', ''])
  }),
  onSortChange: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  className: PropTypes.string,
  tableProps: PropTypes.object,
  children: PropTypes.node
};

AzTableActions.propTypes = {
  children: PropTypes.node,
  row: PropTypes.object,
  index: PropTypes.number,
  isSelected: PropTypes.bool
};

AzTableHeader.propTypes = {
  column: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  sorting: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc', ''])
  }),
  filters: PropTypes.object,
  onSort: PropTypes.func,
  onFilter: PropTypes.func
};

// Para pruebas - importar test simple
import SimpleTest from './SimpleTest';
import TestExample from './TestExample';

// Definir antes de usar
const Table = (props) => {
  // Para pruebas - usar TestExample temporalmente
  if (Object.keys(props).length === 0) {
    // Crear los datos de prueba aquí mismo para evitar dependencias circulares
    const testData = [
      { id: 1, nombre: "Juan Pérez", email: "juan@test.com", estado: "Activo", salario: 50000 },
      { id: 2, nombre: "María García", email: "maria@test.com", estado: "Inactivo", salario: 45000 },
      { id: 3, nombre: "Carlos López", email: "carlos@test.com", estado: "Activo", salario: 55000 }
    ];

    const columns = [
      {
        key: "nombre",
        header: "Nombre",
        sortable: true,
        filterable: true,
        cell: AzTableColumn.Avatar({ nameField: "nombre", emailField: "email" })
      },
      {
        key: "estado",
        header: "Estado",
        sortable: true,
        filterable: true,
        cell: AzTableColumn.Badge({ colorMap: { "Activo": "success", "Inactivo": "danger" } })
      },
      {
        key: "salario",
        header: "Salario",
        sortable: true,
        filterable: true,
        cell: AzTableColumn.Currency({ locale: "es-ES", currency: "EUR" })
      }
    ];

    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between mb-4">
                <h4 className="mb-0">Tabla Genérica AzTable</h4>
                <div className="page-title-right">
                  <small className="text-muted">Componente de tabla reutilizable con funciones avanzadas</small>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <AzTable data={testData} columns={columns} selectedItems={[]} pagination={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Componente real
  return <AzTable {...props} />;
};

// Crear PropTypes específicos para Table (no requeridas para modo demo)
Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.string,
    sortable: PropTypes.bool,
    filterable: PropTypes.bool,
    cell: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })),
  selectedItems: PropTypes.array,
  onSelectedChange: PropTypes.func,
  pagination: PropTypes.bool,
  sorting: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc', ''])
  }),
  onSortChange: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  className: PropTypes.string,
  tableProps: PropTypes.object,
  children: PropTypes.node
};

Table.Actions = AzTable.Actions;
Table.Column = AzTable.Column;

// También exportar AzTable directamente para uso interno
export { AzTable };
export default Table;