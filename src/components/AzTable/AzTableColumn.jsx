import React from "react";
import PropTypes from "prop-types";
import * as ColumnTypes from './types';

const AzTableColumn = {
  Avatar: (props) => ColumnTypes.Avatar(props),
  Badge: (props) => ColumnTypes.Badge(props),
  Currency: (props) => ColumnTypes.Currency(props),
  Date: (props) => ColumnTypes.Date(props),
  Number: (props) => ColumnTypes.Number(props),
  Text: (props) => ColumnTypes.Text(props),
  Link: (props) => ColumnTypes.Link(props),
  Boolean: (props) => ColumnTypes.Boolean(props),

  // Custom renderer for any component
  Custom: (component) => {
    if (typeof component === 'function') {
      return component;
    }
    return ({ getValue, row }) => {
      return React.isValidElement(component)
        ? React.cloneElement(component, { value: getValue(), row: row.original })
        : component;
    };
  }
};

export default AzTableColumn;