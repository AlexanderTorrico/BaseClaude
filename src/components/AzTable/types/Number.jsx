import React from "react";
import PropTypes from "prop-types";

const Number = ({
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

Number.propTypes = {
  locale: PropTypes.string,
  minimumFractionDigits: PropTypes.number,
  maximumFractionDigits: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  className: PropTypes.string
};

export default Number;