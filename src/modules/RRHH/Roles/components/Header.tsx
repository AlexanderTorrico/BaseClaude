import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import AzHeaderCardViews from '../../../../components/aziende/AzHeader/AzHeaderCardViews';
import RoleFormModal from './modals/RoleFormModal';
import { useRoles } from '../hooks/useRoles';
import { setCurrentView } from '../slices/roleSlice';
import { CreateRoleDto } from '../models/CreateRoleDto';
import { UpdateRoleDto } from '../models/UpdateRoleDto';
import { RoleModel } from '../models/RoleModel';

interface HeaderProps {
    loading: boolean;
    onRefresh: () => Promise<void>;
    onCreateRole: (dto: CreateRoleDto) => Promise<{ success: boolean; message: string }>;
    onUpdateRole: (dto: UpdateRoleDto) => Promise<{ success: boolean; message: string }>;
    roleToEdit: RoleModel | null;
    onCloseEditModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
    loading,
    onRefresh,
    onCreateRole,
    onUpdateRole,
    roleToEdit,
    onCloseEditModal
}) => {
    const dispatch = useDispatch();
    const { getTotalRoles, currentView } = useRoles();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Abrir modal cuando se selecciona un rol para editar
    useEffect(() => {
        if (roleToEdit) {
            setIsModalOpen(true);
        }
    }, [roleToEdit]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (isModalOpen && roleToEdit) {
            onCloseEditModal();
        }
    };

    const handleCreateRole = () => {
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        if (roleToEdit) {
            toast.success('Rol actualizado exitosamente');
        } else {
            toast.success('Rol creado exitosamente');
        }
        onCloseEditModal();
    };

    const handleRefresh = async () => {
        await onRefresh();
        console.log('🔄 Datos actualizados desde la API');
    };

    const handleViewChange = (viewKey: string) => {
        dispatch(setCurrentView(viewKey));
    };

    return (
        <>
            <AzHeaderCardViews
                title="Gestión de Roles"
                description="Administra los roles del sistema"
                badge={{
                    count: getTotalRoles(),
                    total: getTotalRoles(),
                    color: 'primary'
                }}
                currentView={currentView}
                onViewChange={handleViewChange}
                views={[
                    { key: '0', name: 'Tabla', icon: 'mdi-table', title: 'Vista Tabla' }
                ]}
                contentTopRight={
                    <div className="d-flex gap-2">
                        <Button
                            color="light"
                            onClick={handleRefresh}
                            className="d-flex align-items-center"
                            disabled={loading}
                            title="Actualizar datos"
                        >
                            <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''} me-1`}></i>
                            Actualizar
                        </Button>
                        <Button
                            color="warning"
                            onClick={handleCreateRole}
                            className="d-flex align-items-center"
                            disabled={loading}
                        >
                            <i className="mdi mdi-plus me-1"></i>
                            Nuevo Rol
                        </Button>
                    </div>
                }
            />

            <RoleFormModal
                isOpen={isModalOpen}
                toggle={toggleModal}
                onSuccess={handleSuccess}
                onCreate={onCreateRole}
                onUpdate={onUpdateRole}
                roleToEdit={roleToEdit}
            />
        </>
    );
};

export default Header;
