import React from 'react';
import AzHeaderCardViewResponsive from './AzHeaderCardViewResponsive';
import ViewSwitcher, { useViewSwitcher } from '../ViewSwitcher';
import ViewRenderer from '../ViewSwitcher/ViewRenderer';

/**
 * AzHeaderCardResponsive - Componente que implementa el patrón deseado:
 *
 * <AzHeaderCardResponsive>
 *   {(setViewWeb, setViewTable, setViewMovil) => (
 *     <AzFilterSummary data={products} columns={columns}>
 *       {(filterState) => {
 *         setViewWeb(<AzTable {...filterState} />);
 *         setViewTable(<AzTable {...filterState} />);
 *         setViewMovil(<ProductGrid {...filterState} />);
 *         return <ViewRenderer {...filterState} />;
 *       }}
 *     </AzFilterSummary>
 *   )}
 * </AzHeaderCardResponsive>
 */
const AzHeaderCardResponsive = ({ children, ...headerProps }) => {
  return (
    <AzHeaderCardViewResponsive {...headerProps}>
      {children}
    </AzHeaderCardViewResponsive>
  );
};

export default AzHeaderCardResponsive;

