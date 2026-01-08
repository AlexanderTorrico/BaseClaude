import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';
import AzHeaderCardViews from '../../../../components/aziende/AzHeader/AzHeaderCardViews';
import PermissionFormModal from './modals/PermissionFormModal';
import { usePermissions } from '../hooks/usePermissions';
import { CreatePermissionDto } from '../models/CreatePermissionDto';

interface HeaderProps {
    loading: boolean;
    onRefresh: () => Promise<void>;
    onCreatePermission: (dto: CreatePermissionDto) => Promise<{ success: boolean; message: string }>;
}

const Header: React.FC<HeaderProps> = ({
    loading,
    onRefresh,
    onCreatePermission,
}) => {
    const { getTotalPermissions } = usePermissions();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCreatePermission = () => {
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        toast.success('Permiso creado exitosamente');
    };

    const handleRefresh = async () => {
        await onRefresh();
        console.log('🔄 Datos actualizados desde la API');
    };

    return (
        <>
            <AzHeaderCardViews
                title="Gestión de Permisos"
                description="Administra los permisos del sistema"
                badge={{
                    count: getTotalPermissions(),
                    total: getTotalPermissions(),
                    color: 'info'
                }}
                currentView="0"
                onViewChange={() => { }}
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
                            color="info"
                            onClick={handleCreatePermission}
                            className="d-flex align-items-center"
                            disabled={loading}
                        >
                            <i className="mdi mdi-plus me-1"></i>
                            Nuevo Permiso
                        </Button>
                    </div>
                }
            />

            <PermissionFormModal
                isOpen={isModalOpen}
                toggle={toggleModal}
                onSuccess={handleSuccess}
                onCreate={onCreatePermission}
            />
        </>
    );
};

export default Header;
