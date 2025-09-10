import React from "react";
import PropTypes from "prop-types";
import { H4 } from "../../../../../components/Atoms";
import { HeaderCardViewResponsive } from "../../../../../components/HeaderCardViews";
import { ResponsiveViewActions } from "../content/ViewActionButtons";
import { SearchRecordsInput } from "../content/SearchInputs";
import { ResponsiveFilterGroup } from "../content/ViewActionButtons";
import UserDataTable from "../components/UserDataTable";
import UserCardsList from "../components/UserCardsList";
import UserGridGallery from "../components/UserGridGallery";
import AddNewUserCard from "../components/AddNewUserCard";

/**
 * ResponsiveExample - Ejemplo complejo de HeaderCardViewResponsive
 * Componente que demuestra el uso completo del sistema responsivo
 */
const ResponsiveExample = React.memo(({
  handleUserEdit,
  handleUserDelete,
  handleAddUser
}) => {
  // Estados locales para el ejemplo responsivo
  const [searchValue, setSearchValue] = React.useState('');

  // Handlers optimizados para el ejemplo responsivo
  const handleNewRecord = React.useCallback(() => {
    console.log('Nuevo registro');
    if (handleAddUser) {
      handleAddUser();
    }
  }, [handleAddUser]);

  const handleFilter = React.useCallback(() => {
    console.log('Filtrar registros');
  }, []);

  const handleSearchChange = React.useCallback((value) => {
    setSearchValue(value);
    console.log('Buscando:', value);
  }, []);

  const handleSearch = React.useCallback((value) => {
    console.log('Búsqueda ejecutada:', value);
  }, []);

  return (
    <React.Fragment>
      <H4 className="mb-3 mt-5 text-warning">HeaderCardViewResponsive (Integrado con Contenido)</H4>

      {/* Ejemplo completo: HeaderCardViewResponsive con nueva estructura de contents */}
      <HeaderCardViewResponsive
        title="Sistema Responsivo Completo"
        description="Header con contenido que cambia automáticamente según el tamaño de pantalla"
        badge={{ count: 25, total: 100 }}
        views={[
          { name: "Web", icon: "mdi-monitor", key: "web" },
          { name: "Tabla", icon: "mdi-table", key: "table" },
          { name: "Móvil", icon: "mdi-cellphone", key: "movil" }
        ]} // Usando objetos para mayor flexibilidad
        breakpoints={{ mobile: 768, tablet: 1024, desktop: 1200 }}
        enableTransitions={true}
        contentTopRight={
          <ResponsiveViewActions onNew={handleNewRecord} />
        }
        contentBottomLeft={
          <SearchRecordsInput
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearch}
          />
        }
        contentBottomRight={
          <ResponsiveFilterGroup onFilter={handleFilter} />
        }
        viewWeb={
          <UserDataTable 
            onEdit={handleUserEdit}
            onDelete={handleUserDelete}
          />
        }
        viewTable={
          <UserCardsList 
            onEdit={handleUserEdit}
            onDelete={handleUserDelete}
          />
        }
        viewMovil={
          <div className="row">
            <UserGridGallery 
              onEdit={handleUserEdit}
              onDelete={handleUserDelete}
            />
            <AddNewUserCard 
              onAdd={handleAddUser}
            />
          </div>
        }
      />
    </React.Fragment>
  );
});

ResponsiveExample.propTypes = {
  handleUserEdit: PropTypes.func.isRequired,
  handleUserDelete: PropTypes.func.isRequired,
  handleAddUser: PropTypes.func.isRequired
};

ResponsiveExample.displayName = "ResponsiveExample";

export default ResponsiveExample;