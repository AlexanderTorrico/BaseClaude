import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

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
        <RouterLink
          to={linkHref}
          className={className}
        >
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

Link.propTypes = {
  hrefField: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string,
  className: PropTypes.string,
  isRouterLink: PropTypes.bool
};

export default Link;