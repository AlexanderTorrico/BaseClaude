import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const CustomSelect = ({ value, onChange, options, placeholder, icon, size = "sm" }) => {
  const sizeStyles = {
    sm: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.8125rem',
      height: '27.46px'
    },
    default: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      height: '27.46px'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.default;

  return (
    <UncontrolledDropdown>
      <DropdownToggle 
        tag="button"
        type="button"
        className="btn btn-light w-100 d-flex justify-content-between align-items-center"
        style={{ 
          textAlign: 'left',
          border: '1px solid #ced4da',
          borderRadius: '0.375rem',
          padding: currentSize.padding,
          fontSize: currentSize.fontSize,
          fontWeight: 'normal',
          color: value === 'all' || !value ? '#6c757d' : '#495057',
          height: currentSize.height
        }}
      >
        <span className="d-flex align-items-center">
          {icon && <i className={`${icon} me-2`}></i>}
          {value === 'all' || !value ? placeholder : options.find(opt => opt.value === value)?.label}
        </span>
        <i className="mdi mdi-chevron-down"></i>
      </DropdownToggle>
      <DropdownMenu className="w-100" style={{ minWidth: '100%' }}>
        {options.map((option, index) => (
          <DropdownItem 
            key={option.value || index}
            onClick={() => onChange(option.value)}
            className={value === option.value ? 'active' : ''}
          >
            {option.icon && <i className={`${option.icon} me-2`}></i>}
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default CustomSelect;
