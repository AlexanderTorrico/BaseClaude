import React from "react";
import PropTypes from "prop-types";

const Date = ({
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

Date.propTypes = {
  format: PropTypes.string,
  locale: PropTypes.string,
  showTime: PropTypes.bool,
  timeFormat: PropTypes.string,
  className: PropTypes.string
};

export default Date;