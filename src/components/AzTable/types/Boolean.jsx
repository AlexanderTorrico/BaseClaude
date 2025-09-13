import React from "react";
import PropTypes from "prop-types";

const Boolean = ({
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

Boolean.propTypes = {
  trueText: PropTypes.string,
  falseText: PropTypes.string,
  trueColor: PropTypes.string,
  falseColor: PropTypes.string,
  showIcon: PropTypes.bool,
  trueIcon: PropTypes.string,
  falseIcon: PropTypes.string,
  className: PropTypes.string
};

export default Boolean;