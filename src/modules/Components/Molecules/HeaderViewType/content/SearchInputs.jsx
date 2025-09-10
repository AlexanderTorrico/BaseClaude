import React from "react";
import PropTypes from "prop-types";
import { InputGroup, InputGroupText, Input } from "reactstrap";

/**
 * SearchInputs - Componentes de búsqueda reutilizables
 * Conjunto de inputs optimizados para contentBottomLeft de Headers
 */

// Input de búsqueda básico con icono
export const SearchInput = React.memo(({ 
  placeholder = "Buscar...", 
  icon = "mdi-magnify",
  size = "sm",
  value,
  onChange,
  onKeyPress,
  className = ""
}) => {
  const handleKeyPress = React.useCallback((e) => {
    if (e.key === 'Enter' && onKeyPress) {
      onKeyPress(e.target.value);
    }
  }, [onKeyPress]);

  return (
    <InputGroup size={size} className={className}>
      <InputGroupText>
        <i className={`mdi ${icon}`}></i>
      </InputGroupText>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
      />
    </InputGroup>
  );
});

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  className: PropTypes.string
};

// Input específico para buscar elementos
export const SearchElementsInput = React.memo(({ 
  value,
  onChange,
  onSearch,
  size = "sm" 
}) => (
  <SearchInput
    placeholder="Buscar elementos..."
    value={value}
    onChange={onChange}
    onKeyPress={onSearch}
    size={size}
  />
));

SearchElementsInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  size: PropTypes.string
};

// Input específico para buscar registros
export const SearchRecordsInput = React.memo(({ 
  value,
  onChange,
  onSearch,
  size = "sm" 
}) => (
  <SearchInput
    placeholder="Buscar registros..."
    value={value}
    onChange={onChange}
    onKeyPress={onSearch}
    size={size}
  />
));

SearchRecordsInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  size: PropTypes.string
};

// Input específico para buscar usuarios
export const SearchUsersInput = React.memo(({ 
  value,
  onChange,
  onSearch,
  size = "sm" 
}) => (
  <SearchInput
    placeholder="Buscar usuarios..."
    value={value}
    onChange={onChange}
    onKeyPress={onSearch}
    size={size}
  />
));

SearchUsersInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  size: PropTypes.string
};

// Input con botón de búsqueda integrado
export const SearchInputWithButton = React.memo(({ 
  placeholder = "Buscar...",
  value,
  onChange,
  onSearch,
  size = "sm",
  buttonColor = "primary"
}) => {
  const handleSearch = React.useCallback(() => {
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch, value]);

  const handleKeyPress = React.useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <InputGroup size={size}>
      <InputGroupText>
        <i className="mdi mdi-magnify"></i>
      </InputGroupText>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
      />
      <button 
        className={`btn btn-${buttonColor}`}
        type="button"
        onClick={handleSearch}
      >
        Buscar
      </button>
    </InputGroup>
  );
});

SearchInputWithButton.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  size: PropTypes.string,
  buttonColor: PropTypes.string
};

// Input de filtro avanzado
export const FilterInput = React.memo(({ 
  placeholder = "Filtrar resultados...",
  icon = "mdi-filter",
  value,
  onChange,
  onFilter,
  size = "sm"
}) => (
  <SearchInput
    placeholder={placeholder}
    icon={icon}
    value={value}
    onChange={onChange}
    onKeyPress={onFilter}
    size={size}
  />
));

FilterInput.propTypes = {
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFilter: PropTypes.func,
  size: PropTypes.string
};