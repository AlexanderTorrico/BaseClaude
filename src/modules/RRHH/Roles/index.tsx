import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { toast } from 'react-toastify';
import { useRoles } from './hooks/useRoles';
import { useRolesFetch } from './hooks/useRolesFetch';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import { roleTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import { RoleApiService } from './services/RoleApiService';
import { RoleModel } from './models/RoleModel';

const roleService = new RoleApiService();

const Roles: React.FC = () => {
    const { roles } = useRoles();
    const { loading, fetchAllRoles, createRole, updateRoleData, deleteRoleData } = useRolesFetch(roleService);
    const [roleToEdit, setRoleToEdit] = useState<RoleModel | null>(null);

    useEffect(() => {
        fetchAllRoles();
    }, []);

    const handleEditRole = (roleId: number) => {
        const role = roles.find(r => r.id === roleId);
        if (role) {
            setRoleToEdit(role);
        }
    };

    const handleDeleteRole = async (roleId: number) => {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;

        // Confirmación antes de eliminar
        const confirmed = window.confirm(`¿Está seguro de eliminar el rol "${role.name}"?`);
        if (!confirmed) return;

        const result = await deleteRoleData(roleId);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="page-content" style={{ overflowX: 'clip' }}>
            <Container fluid style={{ overflowX: 'clip' }}>
                <Header
                    loading={loading}
                    onRefresh={fetchAllRoles}
                    onCreateRole={createRole}
                    onUpdateRole={updateRoleData}
                    roleToEdit={roleToEdit}
                    onCloseEditModal={() => setRoleToEdit(null)}
                />

                <AzFilterSummary
                    data={roles}
                    columns={roleTableColumns}
                    alwaysVisible={true}
                    showCount="always"
                    countPosition="top"
                >
                    {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
                        <Row>
                            <Col xl={12}>
                                <ContentTable
                                    filteredRoles={filteredData}
                                    filters={filters}
                                    sorting={sorting}
                                    onFilterChange={onFilterChange}
                                    onSortChange={onSortChange}
                                    loading={loading}
                                    onEdit={handleEditRole}
                                    onDelete={handleDeleteRole}
                                />
                            </Col>
                        </Row>
                    )}
                </AzFilterSummary>
            </Container>
        </div>
    );
};

export default Roles;
