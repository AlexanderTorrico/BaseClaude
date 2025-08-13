import React, { cloneElement, Children } from "react";
import PropTypes from "prop-types";
import ConfigurableHeader from "./components/ConfigurableHeader";
import ConfigurableContent from "./components/ConfigurableContent";
import { useCrudData } from "./hooks/useCrudData";
import { useCrudFilters } from "./hooks/useCrudFilters";
import { useCrudActions } from "./hooks/useCrudActions";

const CrudFacade = ({
  entity,
  title,
  description,
  fields,
  dataGenerator,
  defaultViewMode = 'cards',
  children
}) => {
  const { data, setData, viewMode, setViewMode } = useCrudData(dataGenerator, defaultViewMode);
  
  const {
    columnFilters,
    sorting,
    cardSearchTerm,
    cardSorting,
    filteredData,
    filteredCardsData,
    handleColumnFilter,
    clearColumnFilter,
    handleSort,
    clearSorting,
    clearAll,
    handleCardSearchChange,
    handleCardSortFieldChange,
    handleCardSortDirectionChange,
    clearCardFilters,
    getActiveCardFilters,
    getActiveFilters
  } = useCrudFilters(data);
  
  const {
    modalOpen,
    deleteModal,
    selectedItems,
    isEditing,
    formData,
    setSelectedItems,
    setFormData,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem,
    confirmDelete,
    handleBulkDelete,
    toggleModal,
    toggleDeleteModal
  } = useCrudActions(data, setData, fields);

  const slots = {
    HeaderActions: null,
    SearchComponent: null,
    DesktopCardsView: null,
    DesktopTableView: null,
    MobileView: null,
    Modal: null
  };

  Children.forEach(children, (child) => {
    if (child?.type?.displayName) {
      slots[child.type.displayName] = child;
    }
  });

  const commonProps = {
    entity,
    data,
    setData,
    viewMode,
    setViewMode,
    filteredData,
    filteredCardsData,
    selectedItems,
    setSelectedItems,
    columnFilters,
    sorting,
    cardSearchTerm,
    cardSorting,
    handleColumnFilter,
    clearColumnFilter,
    handleSort,
    clearSorting,
    clearAll,
    handleCardSearchChange,
    handleCardSortFieldChange,
    handleCardSortDirectionChange,
    clearCardFilters,
    getActiveCardFilters,
    getActiveFilters,
    onAddItem: handleAddItem,
    onEditItem: handleEditItem,
    onDeleteItem: handleDeleteItem,
    onBulkDelete: handleBulkDelete,
    fields
  };

  return (
    <React.Fragment>
      <ConfigurableHeader
        title={title}
        description={description}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedItems={selectedItems}
        filteredData={filteredData}
        data={data}
        getActiveFilters={getActiveFilters}
        sorting={sorting}
        clearColumnFilter={clearColumnFilter}
        clearSorting={clearSorting}
        clearAll={clearAll}
        onAddItem={handleAddItem}
        onBulkDelete={handleBulkDelete}
        headerActionsSlot={slots.HeaderActions}
        searchComponentSlot={slots.SearchComponent}
      />

      <ConfigurableContent
        viewMode={viewMode}
        desktopCardsViewSlot={slots.DesktopCardsView}
        desktopTableViewSlot={slots.DesktopTableView}
        mobileViewSlot={slots.MobileView}
        commonProps={commonProps}
      />

      {slots.Modal && (
        typeof slots.Modal.props.children === 'function' 
          ? slots.Modal.props.children({
              isOpen: modalOpen,
              toggle: toggleModal,
              isEditing,
              formData,
              setFormData,
              onSave: handleSaveItem,
              deleteModal,
              toggleDeleteModal,
              confirmDelete,
              modalOpen,
              ...commonProps
            })
          : cloneElement(slots.Modal, {
              isOpen: modalOpen,
              toggle: toggleModal,
              isEditing,
              formData,
              setFormData,
              onSave: handleSaveItem,
              deleteModal,
              toggleDeleteModal,
              confirmDelete,
              modalOpen,
              ...commonProps
            })
      )}

    </React.Fragment>
  );
};

const HeaderActions = ({ children }) => children;
HeaderActions.displayName = 'HeaderActions';

const SearchComponent = ({ children }) => children;
SearchComponent.displayName = 'SearchComponent';

const DesktopCardsView = ({ children }) => children;
DesktopCardsView.displayName = 'DesktopCardsView';

const DesktopTableView = ({ children }) => children;
DesktopTableView.displayName = 'DesktopTableView';

const MobileView = ({ children }) => children;
MobileView.displayName = 'MobileView';

const Modal = ({ children }) => children;
Modal.displayName = 'Modal';

CrudFacade.HeaderActions = HeaderActions;
CrudFacade.SearchComponent = SearchComponent;
CrudFacade.DesktopCardsView = DesktopCardsView;
CrudFacade.DesktopTableView = DesktopTableView;
CrudFacade.MobileView = MobileView;
CrudFacade.Modal = Modal;

CrudFacade.propTypes = {
  entity: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  fields: PropTypes.object.isRequired,
  dataGenerator: PropTypes.func.isRequired,
  defaultViewMode: PropTypes.oneOf(['cards', 'table']),
  children: PropTypes.node
};

export default CrudFacade;