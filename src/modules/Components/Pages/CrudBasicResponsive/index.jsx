import React from "react";
import { Container, Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { withTranslation } from "react-i18next";
import { AzHeaderCardViewResponsive } from "../../../../components/aziende/AzHeader";
import { AzTable } from "../../../../components/aziende/AzTable";

// Hooks y componentes específicos
import { useCrudBasicResponsive } from "./hooks/crudBasicResponsiveHooks.jsx";
import UserFormModal from "./modals/UserFormModal";
import UserDeleteModal from "./modals/UserDeleteModal";
import UserMobileView from "./components/UserMobileView";
import UserListView from "./components/UserListView";

const CrudBasicResponsive = () => {
    // Meta title
    document.title = "CRUD Usuarios | Gestión - Skote React";

    // Hook personalizado con toda la lógica
    const {
        // Estado
        users,
        loading,
        error,
        selectedUser,
        userStats,

        // Estados de modales
        isCreateModalOpen,
        isEditModalOpen,
        isDeleteModalOpen,

        // Estados de operaciones
        creating,
        updating,
        deleting,

        // Operaciones CRUD
        handleCreateUser,
        handleUpdateUser,
        handleDeleteUser,
        handleRefreshUsers,

        // Operaciones de modales
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleOpenEditModal,
        handleCloseEditModal,
        handleOpenDeleteModal,
        handleCloseDeleteModal,

        // Configuración de tabla
        tableColumns,
        tableActions
    } = useCrudBasicResponsive();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <AzHeaderCardViewResponsive
                        title="Gestión de Usuarios"
                        description={`Panel de administración de usuarios del sistema - ${userStats.total} usuarios registrados`}
                        badge={{
                            count: userStats.active,
                            total: userStats.total,
                            color: "success"
                        }}
                        views={[
                            { name: "Tabla", icon: "mdi-table", key: "web" },
                            { name: "Lista", icon: "mdi-view-list", key: "table" },
                            { name: "Cards", icon: "mdi-view-grid", key: "movil" }
                        ]}
                        breakpoints={{ mobile: 768, tablet: 1024, desktop: 1200 }}
                        enableTransitions={true}

                        // Vista Web (Desktop): Tabla completa con AzTable
                        viewWeb={
                            <AzTable
                                data={users}
                                columns={tableColumns}
                                loading={loading}
                                showActions={true}
                                pagination={false}
                                components={
                                    <div className="d-flex gap-1">
                                        <Button
                                            color="primary"
                                            size="sm"
                                            onClick={(user) => handleOpenEditModal(user)}
                                            title="Editar"
                                        >
                                            <i className="mdi mdi-pencil"></i>
                                        </Button>
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={(user) => handleOpenDeleteModal(user)}
                                            title="Eliminar"
                                        >
                                            <i className="mdi mdi-delete"></i>
                                        </Button>
                                    </div>
                                }
                            />
                        }
                        // Vista Table (Tablet): Lista compacta
                        viewTable={
                            <UserListView
                                users={users}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                            />
                        }
                        // Vista Móvil: Cards
                        viewMovil={
                            <UserMobileView
                                users={users}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                            />
                        }
                    />

                    {/* Modales */}
                    <UserFormModal
                        isOpen={isCreateModalOpen}
                        onClose={handleCloseCreateModal}
                        onSubmit={handleCreateUser}
                        user={null}
                        loading={creating}
                        error={error}
                    />

                    <UserFormModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        onSubmit={handleUpdateUser}
                        user={selectedUser}
                        loading={updating}
                        error={error}
                    />

                    <UserDeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={handleCloseDeleteModal}
                        onConfirm={handleDeleteUser}
                        user={selectedUser}
                        loading={deleting}
                    />
                </Container>
            </div>
        </React.Fragment>
    );
};

CrudBasicResponsive.propTypes = {};
export default withTranslation()(CrudBasicResponsive);