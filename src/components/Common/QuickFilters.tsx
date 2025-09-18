import React, { useState } from 'react';
import {
  Badge,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col
} from 'reactstrap';
const QuickFilters = ({ 
  filters = {},
  activeFilters = {},
  onFilterChange,
  onClearAll,
  className = "",
  showFilterCount = true,
  maxVisibleFilters = 5
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleFilterSelect = (filterKey, value) => {
    onFilterChange(filterKey, value);
  };

  const handleRemoveFilter = (filterKey) => {
    onFilterChange(filterKey, null);
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => 
      activeFilters[key] && activeFilters[key] !== 'all'
    ).length;
  };

  const getFilterIcon = (filterConfig) => {
    return filterConfig.icon || 'mdi-filter-outline';
  };

  const getFilterColor = (filterKey, isActive) => {
    const filterConfig = filters[filterKey];
    if (isActive && filterConfig?.activeColor) {
      return filterConfig.activeColor;
    }
    return isActive ? 'primary' : 'light';
  };

  const renderFilterBadge = (filterKey, filterConfig) => {
    const isActive = activeFilters[filterKey] && activeFilters[filterKey] !== 'all';
    const activeValue = activeFilters[filterKey];
    const selectedOption = filterConfig.options?.find(opt => opt.value === activeValue);
    
    return (
      <Badge
        key={filterKey}
        color={getFilterColor(filterKey, isActive)}
        className={`me-2 mb-2 d-inline-flex align-items-center filter-badge ${isActive ? 'active' : ''}`}
        style={{
          cursor: 'pointer',
          fontSize: '0.85rem',
          padding: '0.5rem 0.75rem',
          transition: 'all 0.2s ease',
          border: isActive ? 'none' : '1px solid #dee2e6'
        }}
      >
        <UncontrolledDropdown>
          <DropdownToggle
            tag="span"
            className="d-flex align-items-center"
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            <i className={`${getFilterIcon(filterConfig)} me-1`}></i>
            <span>{filterConfig.label}</span>
            {isActive && selectedOption && (
              <>
                <span className="mx-1">:</span>
                <strong>{selectedOption.label}</strong>
              </>
            )}
            <i className="mdi mdi-chevron-down ms-1" style={{ fontSize: '0.8rem' }}></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>
              <i className={`${getFilterIcon(filterConfig)} me-2`}></i>
              {filterConfig.label}
            </DropdownItem>
            <DropdownItem divider />
            {filterConfig.options?.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => handleFilterSelect(filterKey, option.value)}
                className={activeFilters[filterKey] === option.value ? 'active' : ''}
              >
                {option.icon && <i className={`${option.icon} me-2`}></i>}
                {option.label}
                {option.count !== undefined && (
                  <Badge color="secondary" className="ms-auto">
                    {option.count}
                  </Badge>
                )}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
        
        {isActive && (
          <Button
            color="link"
            size="sm"
            className="p-0 ms-2 text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveFilter(filterKey);
            }}
            style={{ fontSize: '0.8rem', textDecoration: 'none' }}
          >
            <i className="mdi mdi-close"></i>
          </Button>
        )}
      </Badge>
    );
  };

  const renderToggleFilters = () => {
    const filterKeys = Object.keys(filters);
    const activeCount = getActiveFilterCount();
    const visibleKeys = collapsed ? filterKeys.slice(0, maxVisibleFilters) : filterKeys;
    const hiddenCount = filterKeys.length - maxVisibleFilters;

    return (
      <>
        {visibleKeys.map(filterKey => renderFilterBadge(filterKey, filters[filterKey]))}
        
        {hiddenCount > 0 && collapsed && (
          <Badge
            color="secondary"
            className="me-2 mb-2 cursor-pointer"
            onClick={() => setCollapsed(false)}
            style={{
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '0.5rem 0.75rem'
            }}
          >
            <i className="mdi mdi-dots-horizontal me-1"></i>
            +{hiddenCount} más
          </Badge>
        )}
        
        {!collapsed && filterKeys.length > maxVisibleFilters && (
          <Badge
            color="light"
            className="me-2 mb-2 cursor-pointer"
            onClick={() => setCollapsed(true)}
            style={{
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '0.5rem 0.75rem',
              border: '1px solid #dee2e6'
            }}
          >
            <i className="mdi mdi-chevron-up me-1"></i>
            Mostrar menos
          </Badge>
        )}
      </>
    );
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className={`quick-filters ${className}`}>
      <Row className="align-items-center">
        <Col>
          <div className="d-flex flex-wrap align-items-center">
            <div className="me-3 mb-2">
              <span className="text-muted me-2">Filtros:</span>
              {showFilterCount && activeCount > 0 && (
                <Badge color="primary" className="me-2">
                  {activeCount} activo{activeCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            {renderToggleFilters()}
            
            {activeCount > 0 && (
              <Button
                color="outline-secondary"
                size="sm"
                onClick={onClearAll}
                className="mb-2"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="mdi mdi-close-circle me-1"></i>
                Limpiar todo
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .filter-badge {
          transition: all 0.2s ease;
        }
        
        .filter-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .filter-badge.active {
          font-weight: 600;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .quick-filters .dropdown-menu {
          min-width: 200px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .quick-filters .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
        }
        
        .quick-filters .dropdown-item.active {
          background-color: #556ee6;
          color: white;
        }
        
        .quick-filters .dropdown-item:hover:not(.active) {
          background-color: #f8f9fa;
        }
        
        @media (max-width: 768px) {
          .quick-filters .d-flex {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .filter-badge {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickFilters;

