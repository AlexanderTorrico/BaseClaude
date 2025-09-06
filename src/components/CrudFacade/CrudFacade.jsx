import React, { cloneElement, Children } from "react";
import PropTypes from "prop-types";
import ConfigurableHeader from "./components/ConfigurableHeader";
import ConfigurableContent from "./components/ConfigurableContent";
import GenericModal from "./components/GenericModal";
import { useCrudData } from "./hooks/useCrudData";
import { useCrudFilters } from "./hooks/useCrudFilters";
import { useCrudActions } from "./hooks/useCrudActions";
import { useResponsive } from "../Common/useResponsive";
import { createResponsiveConfig } from "./config/responsiveConfig";

const CrudFacade = ({
  entity,
  title,
  description,
  fields,
  dataGenerator,
  defaultViewMode = 'auto', // 'auto' para detección automática, o 'cards'/'table'
  breakpoints, // Opcional: {mobile: 768, tablet: 1024, desktop: 1200}
  children
}) => {
  // Crear configuración responsive interna
  const responsiveConfig = createResponsiveConfig(breakpoints ? { breakpoints } : {});
  
  // Hook para detección responsive
  const responsive = useResponsive({
    breakpoints: responsiveConfig.breakpoints,
    defaultViews: responsiveConfig.defaultViews,
    viewToggle: responsiveConfig.viewToggle
  });

  // Determinar vista por defecto automáticamente o usar la especificada
  const resolvedDefaultViewMode = defaultViewMode === 'auto' 
    ? responsive.getDefaultViewMode()
    : defaultViewMode;
  const { data, setData, viewMode, setViewMode } = useCrudData(dataGenerator, resolvedDefaultViewMode);
  
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
    getActiveFilters,
    // Nuevas funciones unificadas
    handleColumnFilterUnified,
    handleSortUnified,
    getActiveUnifiedFilters,
    unifiedFilteredData
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
    WebView: null,
    CardView: null,
    MobileView: null,
    Modal: null
  };

  // Mapeo de compatibilidad con nombres anteriores
  const slotMapping = {
    'TableSlot': 'WebView',
    'CardsSlot': 'CardView', 
    'DesktopCardsView': 'CardView',
    'DesktopTableView': 'WebView'
  };

  Children.forEach(children, (child) => {
    if (child?.type?.displayName) {
      const slotName = slotMapping[child.type.displayName] || child.type.displayName;
      slots[slotName] = child;
    }
  });

  // Detectar vistas disponibles
  const availableViews = {
    hasWebView: !!slots.WebView,
    hasCardView: !!slots.CardView,
    hasMobileView: !!slots.MobileView
  };

  // Determinar si mostrar selector de vista - mostrar siempre que tengamos al menos una vista personalizada
  const shouldShowViewToggle = availableViews.hasWebView || availableViews.hasCardView;

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
    // Funciones originales (mantener compatibilidad)
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
    // Nuevas funciones unificadas
    handleColumnFilterUnified,
    handleSortUnified,
    getActiveUnifiedFilters,
    unifiedFilteredData,
    onAddItem: handleAddItem,
    onEditItem: handleEditItem,
    onDeleteItem: handleDeleteItem,
    onBulkDelete: handleBulkDelete,
    fields,
    // Añadir configuración responsive y de vistas disponibles
    responsive: {
      ...responsive,
      layout: responsiveConfig.layout[responsive.deviceType],
      mediaQueries: responsiveConfig.getMediaQueries(),
      showViewToggle: shouldShowViewToggle
    },
    availableViews
  };

  return (
    <React.Fragment>
      <ConfigurableHeader
        title={title}
        description={description}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedItems={selectedItems}
        filteredData={unifiedFilteredData}
        data={data}
        getActiveFilters={getActiveUnifiedFilters}
        sorting={sorting}
        clearColumnFilter={clearColumnFilter}
        clearSorting={clearSorting}
        clearAll={clearAll}
        onAddItem={handleAddItem}
        onBulkDelete={handleBulkDelete}
        headerActionsSlot={slots.HeaderActions}
        searchComponentSlot={slots.SearchComponent}
        cardSearchTerm={cardSearchTerm}
        cardSorting={cardSorting}
        filteredCardsData={unifiedFilteredData}
        handleCardSearchChange={handleCardSearchChange}
        handleCardSortFieldChange={handleCardSortFieldChange}
        handleCardSortDirectionChange={handleCardSortDirectionChange}
        clearCardFilters={clearCardFilters}
        getActiveCardFilters={getActiveUnifiedFilters}
        availableViews={availableViews}
      />

      <ConfigurableContent
        viewMode={viewMode}
        webViewSlot={slots.WebView}
        cardViewSlot={slots.CardView}
        mobileViewSlot={slots.MobileView}
        commonProps={commonProps}
        availableViews={availableViews}
      />

      {/* Modal genérico con encapsulación de lógica */}
      <GenericModal
        deleteModalProps={{
          show: deleteModal,
          onDeleteClick: confirmDelete,
          onCloseClick: toggleDeleteModal
        }}
      >
        {slots.Modal && (
          typeof slots.Modal.props.children === 'function' 
            ? slots.Modal.props.children({
                isOpen: modalOpen,
                toggle: toggleModal,
                isEditing,
                formData,
                setFormData,
                onSave: handleSaveItem,
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
                modalOpen,
                ...commonProps
              })
        )}
      </GenericModal>

    </React.Fragment>
  );
};

const HeaderActions = ({ children }) => children;
HeaderActions.displayName = 'HeaderActions';

const SearchComponent = ({ children }) => children;
SearchComponent.displayName = 'SearchComponent';

const WebView = ({ children }) => children;
WebView.displayName = 'WebView';

const CardView = ({ children }) => children;
CardView.displayName = 'CardView';

// Mantenemos compatibilidad con nombres anteriores
const TableSlot = ({ children }) => children;
TableSlot.displayName = 'TableSlot';

const CardsSlot = ({ children }) => children;
CardsSlot.displayName = 'CardsSlot';

const DesktopCardsView = ({ children }) => children;
DesktopCardsView.displayName = 'DesktopCardsView';

const DesktopTableView = ({ children }) => children;
DesktopTableView.displayName = 'DesktopTableView';

const MobileView = ({ children }) => children;
MobileView.displayName = 'MobileView';

const Modal = ({ children }) => children;
Modal.displayName = 'Modal';

// Nuevos slots principales
CrudFacade.WebView = WebView;
CrudFacade.CardView = CardView;
CrudFacade.MobileView = MobileView;

// Mantenemos compatibilidad con nombres anteriores
CrudFacade.TableSlot = TableSlot;
CrudFacade.CardsSlot = CardsSlot;
CrudFacade.DesktopCardsView = DesktopCardsView;
CrudFacade.DesktopTableView = DesktopTableView;

// Otros slots
CrudFacade.HeaderActions = HeaderActions;
CrudFacade.SearchComponent = SearchComponent;
CrudFacade.Modal = Modal;

CrudFacade.propTypes = {
  entity: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  fields: PropTypes.object.isRequired,
  dataGenerator: PropTypes.func.isRequired,
  defaultViewMode: PropTypes.oneOf(['cards', 'table', 'auto']),
  breakpoints: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number
  }),
  children: PropTypes.node
};

export default CrudFacade;