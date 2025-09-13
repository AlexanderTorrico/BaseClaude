import React from "react";
import PropTypes from "prop-types";
import { Badge as BootstrapBadge } from "reactstrap";

const Badge = ({
  colorMap = {},
  defaultColor = "secondary",
  pill = true,
  className = ""
}) => {
  return ({ getValue }) => {
    const value = getValue();
    const color = colorMap[value] || defaultColor;

    return (
      <BootstrapBadge
        color={color}
        pill={pill}
        className={className}
      >
        {value}
      </BootstrapBadge>
    );
  };
};

Badge.propTypes = {
  colorMap: PropTypes.object,
  defaultColor: PropTypes.string,
  pill: PropTypes.bool,
  className: PropTypes.string
};

export default Badge;