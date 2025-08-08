import React, { useState, useRef, useEffect } from 'react';
import {
  InputGroup,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Spinner
} from 'reactstrap';
import PropTypes from 'prop-types';

const SearchBar = ({ 
  value,
  onChange,
  onClear,
  placeholder = "Buscar...",
  suggestions = [],
  loading = false,
  showClearButton = true,
  size = "md",
  icon = "mdi-magnify",
  onSuggestionSelect,
  disabled = false,
  className = "",
  recentSearches = [],
  onRecentSearchSelect,
  maxSuggestions = 8
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);
  
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
    
    if (newValue && (suggestions.length > 0 || recentSearches.length > 0)) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    setDropdownOpen(false);
    onClear?.();
    onChange('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalValue(suggestion);
    setDropdownOpen(false);
    onSuggestionSelect?.(suggestion);
    onChange(suggestion);
  };

  const handleRecentSearchClick = (search) => {
    setLocalValue(search);
    setDropdownOpen(false);
    onRecentSearchSelect?.(search);
    onChange(search);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (localValue && (suggestions.length > 0 || recentSearches.length > 0)) {
      setDropdownOpen(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setDropdownOpen(false), 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(localValue.toLowerCase()) &&
      suggestion.toLowerCase() !== localValue.toLowerCase()
    )
    .slice(0, maxSuggestions);

  const showDropdown = dropdownOpen && (filteredSuggestions.length > 0 || (!localValue && recentSearches.length > 0));

  return (
    <div className={`search-bar-container ${className}`} style={{ position: 'relative' }}>
      <InputGroup size={size}>
        <Button 
          color="light" 
          outline
          disabled={disabled}
          style={{ 
            borderRight: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }}
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <i className={`mdi ${icon}`}></i>
          )}
        </Button>
        
        <Input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`${isFocused ? 'focused' : ''}`}
          style={{
            borderLeft: 0,
            borderRight: showClearButton && localValue ? 0 : undefined,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: showClearButton && localValue ? 0 : undefined,
            borderBottomRightRadius: showClearButton && localValue ? 0 : undefined
          }}
        />
        
        {showClearButton && localValue && (
          <Button
            color="light"
            outline
            onClick={handleClear}
            disabled={disabled}
            style={{
              borderLeft: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0
            }}
          >
            <i className="mdi mdi-close"></i>
          </Button>
        )}
      </InputGroup>

      {/* Dropdown con sugerencias */}
      {showDropdown && (
        <div 
          className="search-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1050,
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '0.375rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '2px'
          }}
        >
          {/* Búsquedas recientes */}
          {!localValue && recentSearches.length > 0 && (
            <>
              <div className="px-3 py-2 border-bottom bg-light">
                <small className="text-muted d-flex align-items-center">
                  <i className="mdi mdi-clock-outline me-2"></i>
                  Búsquedas recientes
                </small>
              </div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <div
                  key={`recent-${index}`}
                  className="px-3 py-2 border-bottom cursor-pointer hover-bg-light"
                  onClick={() => handleRecentSearchClick(search)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-clock-outline text-muted me-2"></i>
                    <span>{search}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Sugerencias */}
          {filteredSuggestions.length > 0 && (
            <>
              {!localValue && recentSearches.length > 0 && <hr className="my-0" />}
              {localValue && (
                <div className="px-3 py-2 border-bottom bg-light">
                  <small className="text-muted d-flex align-items-center">
                    <i className="mdi mdi-lightbulb-outline me-2"></i>
                    Sugerencias
                  </small>
                </div>
              )}
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={`suggestion-${index}`}
                  className="px-3 py-2 border-bottom cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-magnify text-muted me-2"></i>
                    <span dangerouslySetInnerHTML={{
                      __html: suggestion.replace(
                        new RegExp(`(${localValue})`, 'gi'),
                        '<strong>$1</strong>'
                      )
                    }} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .search-bar-container .form-control.focused {
          border-color: #74788d;
          box-shadow: 0 0 0 0.2rem rgba(116, 120, 141, 0.25);
        }
        
        .search-dropdown {
          animation: fadeIn 0.15s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  showClearButton: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.string,
  onSuggestionSelect: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  recentSearches: PropTypes.arrayOf(PropTypes.string),
  onRecentSearchSelect: PropTypes.func,
  maxSuggestions: PropTypes.number
};

export default SearchBar;