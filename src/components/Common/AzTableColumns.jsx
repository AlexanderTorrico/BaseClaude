import React from "react";
import { Badge as BootstrapBadge } from "reactstrap";
import { Link as RouterLink } from "react-router-dom";

// ========================================
// TIPOS DE COLUMNA PERSONALIZADOS
// ========================================

/**
 * AVATAR - Muestra avatar con nombre y email opcional
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

// Configuración de tipos de columna
const AzTableColumns = {
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

export default AzTableColumns;