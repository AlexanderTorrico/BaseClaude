import React from "react";
import PropTypes from "prop-types";

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

    return <span className={className}>{formattedValue}</span>;
  };
};

Currency.propTypes = {
  symbol: PropTypes.string,
  locale: PropTypes.string,
  currency: PropTypes.string,
  minimumFractionDigits: PropTypes.number,
  maximumFractionDigits: PropTypes.number,
  className: PropTypes.string
};

export default Currency;