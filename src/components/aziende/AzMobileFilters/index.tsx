import React, { useState, useMemo } from 'react';
import { Collapse, Input, Badge } from 'reactstrap';

interface ColumnConfig {
  key: string;
  header: string;
  filterType?: 'text' | 'select';
  filterOptions?: string[];
  filterable?: boolean;
}

interface MobileFilterConfig {
  key: string;
  label?: string;
  type?: 'text' | 'select';
  options?: string[];
  placeholder?: string;
}

interface AzMobileFiltersProps {
  columns: ColumnConfig[];
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  mobileFilterKeys?: string[];
  mobileFilterConfig?: MobileFilterConfig[];
  className?: string;
  collapsedLabel?: string;
  expandedLabel?: string;
}

/**
 * AzMobileFilters - Barra colapsable de filtros para vista móvil
 *
 * Uso básico (usa todas las columnas filtrables):
 * <AzMobileFilters
 *   columns={columns}
 *   filters={filters}
 *   onFilterChange={onFilterChange}
 *   onClearAll={onClearAll}
 * />
 *
 * Uso con columnas específicas:
 * <AzMobileFilters
 *   columns={columns}
 *   filters={filters}
 *   onFilterChange={onFilterChange}
 *   onClearAll={onClearAll}
 *   mobileFilterKeys={['name', 'email', 'is_active']}
 * />
 *
 * Uso con configuración personalizada:
 * <AzMobileFilters
 *   columns={columns}
 *   filters={filters}
 *   onFilterChange={onFilterChange}
 *   onClearAll={onClearAll}
 *   mobileFilterConfig={[
 *     { key: 'name', label: 'Buscar por nombre', placeholder: 'Nombre...' },
 *     { key: 'is_active', label: 'Estado', type: 'select', options: ['Sí', 'No'] }
 *   ]}
 * />
 */
const AzMobileFilters: React.FC<AzMobileFiltersProps> = ({
  columns,
  filters,
  onFilterChange,
  mobileFilterKeys,
  mobileFilterConfig,
  className = '',
  collapsedLabel = 'Filtros',
  expandedLabel = 'Ocultar filtros'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // Contar filtros activos
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v && v.trim() !== '').length;
  }, [filters]);

  // Determinar qué filtros mostrar
  const filterableColumns = useMemo(() => {
    // Si hay configuración personalizada, usarla
    if (mobileFilterConfig && mobileFilterConfig.length > 0) {
      return mobileFilterConfig.map(config => {
        const column = columns.find(c => c.key === config.key);
        return {
          key: config.key,
          header: config.label || column?.header || config.key,
          filterType: config.type || column?.filterType || 'text',
          filterOptions: config.options || column?.filterOptions,
          placeholder: config.placeholder
        };
      });
    }

    // Si hay keys específicas, filtrar por ellas
    if (mobileFilterKeys && mobileFilterKeys.length > 0) {
      return columns
        .filter(col => mobileFilterKeys.includes(col.key))
        .filter(col => col.filterable !== false);
    }

    // Por defecto, usar todas las columnas filtrables
    return columns.filter(col => col.filterable !== false);
  }, [columns, mobileFilterKeys, mobileFilterConfig]);

  return (
    <div className={`az-mobile-filters ${className}`}>
      {/* Barra colapsada/expandida */}
      <div
        className="d-flex align-items-center justify-content-between p-2 bg-light border rounded cursor-pointer"
        onClick={toggle}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center gap-2">
          <i className={`mdi ${isOpen ? 'mdi-filter-minus' : 'mdi-filter-plus'} text-primary`}></i>
          <span className="fw-medium">
            {isOpen ? expandedLabel : collapsedLabel}
          </span>
          {activeFilterCount > 0 && (
            <Badge color="primary" pill>
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <i className={`mdi ${isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i>
      </div>

      {/* Contenido colapsable con filtros */}
      <Collapse isOpen={isOpen}>
        <div className="p-3 bg-white border border-top-0 rounded-bottom">
          <div className="d-flex flex-column gap-3">
            {filterableColumns.map((column) => (
              <div key={column.key} className="filter-field">
                <label className="form-label small text-muted mb-1">
                  {column.header}
                </label>
                {column.filterType === 'select' && column.filterOptions ? (
                  <Input
                    type="select"
                    bsSize="sm"
                    value={filters[column.key] || ''}
                    onChange={(e) => onFilterChange(column.key, e.target.value)}
                  >
                    <option value="">Todos</option>
                    {column.filterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                ) : (
                  <Input
                    type="text"
                    bsSize="sm"
                    placeholder={column.placeholder || `Buscar ${column.header.toLowerCase()}...`}
                    value={filters[column.key] || ''}
                    onChange={(e) => onFilterChange(column.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default AzMobileFilters;
