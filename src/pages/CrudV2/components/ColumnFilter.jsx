import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, InputGroup, InputGroupText } from "reactstrap";

const ColumnFilter = React.memo(({ column, value, onChange, placeholder = "Filtrar..." }) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const debounceRef = useRef(null);
  
  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (!newValue || newValue.trim() === '') {
      onChange(column, newValue);
    } else {
      debounceRef.current = setTimeout(() => {
        onChange(column, newValue);
      }, 300);
    }
  }, [column, onChange]);

  const handleClear = useCallback(() => {
    setInternalValue('');
    onChange(column, '');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, [column, onChange]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="column-filter-container" style={{ marginTop: '8px' }}>
      <InputGroup size="sm">
        <Input
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          style={{ 
            fontSize: '12px', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}
        />
        {internalValue && (
          <InputGroupText 
            className="pe-2"
            style={{ 
              cursor: 'pointer',
              border: '1px solid #dee2e6',
              borderLeft: 'none',
              background: '#f8f9fa'
            }}
            onClick={handleClear}
          >
            <i className="mdi mdi-close" style={{ fontSize: '12px' }}></i>
          </InputGroupText>
        )}
      </InputGroup>
    </div>
  );
});

ColumnFilter.displayName = 'ColumnFilter';

export default ColumnFilter;