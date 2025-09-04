import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import UserCardsViewSimple from "../../CrudComponents/UserCardsViewSimple";
import UserTableView from "../../CrudComponents/UserTableView";
import MobileCardsView from "../../CrudComponents/MobileCardsView";

const ConfigurableContent = ({
  viewMode,
  webViewSlot,
  cardViewSlot,
  mobileViewSlot,
  commonProps,
  availableViews
}) => {
  const renderDefaultDesktopCardsView = () => (
    <UserCardsViewSimple 
      usuariosFiltradosCards={commonProps.filteredCardsData}
      usuarios={commonProps.data}
      cardSearchTerm={commonProps.cardSearchTerm}
      cardSorting={commonProps.cardSorting}
      onSearchChange={commonProps.handleCardSearchChange}
      onSortFieldChange={commonProps.handleCardSortFieldChange}
      onSortDirectionChange={commonProps.handleCardSortDirectionChange}
      onClearFilters={commonProps.clearCardFilters}
      onEditUser={commonProps.onEditItem}
      onDeleteUser={commonProps.onDeleteItem}
    />
  );

  const renderDefaultDesktopTableView = () => (
    <UserTableView 
      usuariosFiltrados={commonProps.filteredData}
      usuariosSeleccionados={commonProps.selectedItems}
      setUsuariosSeleccionados={commonProps.setSelectedItems}
      columnFilters={commonProps.columnFilters}
      sorting={commonProps.sorting}
      handleColumnFilter={commonProps.handleColumnFilter}
      handleSort={commonProps.handleSort}
      onEditUser={commonProps.onEditItem}
      onDeleteUser={commonProps.onDeleteItem}
    />
  );

  const renderDefaultMobileView = () => (
    <MobileCardsView 
      usuariosFiltrados={commonProps.filteredCardsData}
      usuarios={commonProps.data}
      cardSearchTerm={commonProps.cardSearchTerm}
      cardSorting={commonProps.cardSorting}
      handleCardSearchChange={commonProps.handleCardSearchChange}
      handleCardSortFieldChange={commonProps.handleCardSortFieldChange}
      handleCardSortDirectionChange={commonProps.handleCardSortDirectionChange}
      clearCardFilters={commonProps.clearCardFilters}
      getActiveCardFilters={commonProps.getActiveCardFilters}
      onEditUser={commonProps.onEditItem}
      onDeleteUser={commonProps.onDeleteItem}
      onAddUser={commonProps.onAddItem}
      onBulkDelete={commonProps.onBulkDelete}
      selectedUsers={commonProps.selectedItems}
      onViewModeChange={commonProps.setViewMode}
      currentViewMode={commonProps.viewMode}
    />
  );

  // Lógica para determinar qué componente usar según las vistas disponibles
  const getDesktopComponent = (currentViewMode) => {
    if (currentViewMode === 'cards') {
      // Para vista cards: usar CardView si existe, sino WebView, sino default
      if (cardViewSlot) {
        return typeof cardViewSlot.props.children === 'function'
          ? cardViewSlot.props.children(commonProps)
          : cloneElement(cardViewSlot, commonProps);
      } else if (webViewSlot) {
        return typeof webViewSlot.props.children === 'function'
          ? webViewSlot.props.children(commonProps)
          : cloneElement(webViewSlot, commonProps);
      } else {
        return renderDefaultDesktopCardsView();
      }
    } else {
      // Para vista table: usar WebView si existe, sino default
      if (webViewSlot) {
        return typeof webViewSlot.props.children === 'function'
          ? webViewSlot.props.children(commonProps)
          : cloneElement(webViewSlot, commonProps);
      } else {
        return renderDefaultDesktopTableView();
      }
    }
  };

  return (
    <>
      {/* Vista de escritorio */}
      <div className="d-none d-md-block">
        {getDesktopComponent(viewMode)}
      </div>

      {/* Vista móvil - Siempre usa cards */}
      <div className="d-md-none">
        {mobileViewSlot 
          ? (typeof mobileViewSlot.props.children === 'function'
              ? mobileViewSlot.props.children(commonProps)
              : cloneElement(mobileViewSlot, commonProps))
          : renderDefaultMobileView()
        }
      </div>
    </>
  );
};

ConfigurableContent.propTypes = {
  viewMode: PropTypes.string.isRequired,
  webViewSlot: PropTypes.node,
  cardViewSlot: PropTypes.node,
  mobileViewSlot: PropTypes.node,
  commonProps: PropTypes.object.isRequired,
  availableViews: PropTypes.shape({
    hasWebView: PropTypes.bool,
    hasCardView: PropTypes.bool,
    hasMobileView: PropTypes.bool
  })
};

export default ConfigurableContent;