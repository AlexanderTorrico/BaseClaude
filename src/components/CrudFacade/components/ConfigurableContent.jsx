import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import UserCardsView from "../../CrudComponents/UserCardsView";
import UserTableView from "../../CrudComponents/UserTableView";
import MobileCardsView from "../../CrudComponents/MobileCardsView";

const ConfigurableContent = ({
  viewMode,
  desktopCardsViewSlot,
  desktopTableViewSlot,
  mobileViewSlot,
  commonProps
}) => {
  const renderDefaultDesktopCardsView = () => (
    <UserCardsView 
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
      onAddUser={commonProps.onAddItem}
      onBulkDelete={commonProps.onBulkDelete}
      selectedUsers={commonProps.selectedItems}
      onViewModeChange={commonProps.setViewMode}
      currentViewMode={commonProps.viewMode}
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

  return (
    <>
      {/* Vista de escritorio */}
      <div className="d-none d-md-block">
        {viewMode === 'cards' ? (
          desktopCardsViewSlot 
            ? cloneElement(desktopCardsViewSlot, commonProps)
            : renderDefaultDesktopCardsView()
        ) : (
          desktopTableViewSlot 
            ? cloneElement(desktopTableViewSlot, commonProps)
            : renderDefaultDesktopTableView()
        )}
      </div>

      {/* Vista móvil - Siempre usa cards */}
      <div className="d-md-none">
        {mobileViewSlot 
          ? cloneElement(mobileViewSlot, commonProps)
          : renderDefaultMobileView()
        }
      </div>
    </>
  );
};

ConfigurableContent.propTypes = {
  viewMode: PropTypes.string.isRequired,
  desktopCardsViewSlot: PropTypes.node,
  desktopTableViewSlot: PropTypes.node,
  mobileViewSlot: PropTypes.node,
  commonProps: PropTypes.object.isRequired
};

export default ConfigurableContent;