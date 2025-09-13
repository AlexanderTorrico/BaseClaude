import React from "react";
import PropTypes from "prop-types";

const Text = ({
  maxLength = null,
  transform = null,
  className = "",
  showTooltip = false
}) => {
  return ({ getValue }) => {
    let value = getValue() || "";

    // Apply text transformations
    if (transform === "uppercase") {
      value = value.toString().toUpperCase();
    } else if (transform === "lowercase") {
      value = value.toString().toLowerCase();
    } else if (transform === "capitalize") {
      value = value.toString().charAt(0).toUpperCase() + value.toString().slice(1).toLowerCase();
    }

    // Apply length truncation
    const displayValue = maxLength && value.length > maxLength
      ? `${value.substring(0, maxLength)}...`
      : value;

    const shouldShowTooltip = showTooltip && maxLength && value.length > maxLength;

    return (
      <span
        className={className}
        title={shouldShowTooltip ? value : undefined}
      >
        {displayValue}
      </span>
    );
  };
};

Text.propTypes = {
  maxLength: PropTypes.number,
  transform: PropTypes.oneOf(['uppercase', 'lowercase', 'capitalize']),
  className: PropTypes.string,
  showTooltip: PropTypes.bool
};

export default Text;