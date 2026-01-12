import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { usePermissions } from './hooks/usePermissions';
import { usePermissionsFetch } from './hooks/usePermissionsFetch';
import AzFilterSummary from '../../../components/aziende/AzFilterSummary';
import { permissionTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import { PermissionApiService } from './services/PermissionApiService';

const permissionService = new PermissionApiService();

const Permissions: React.FC = () => {
    const { permissions } = usePermissions();
    const { loading, fetchAllPermissions, createPermission } = usePermissionsFetch(permissionService);

    useEffect(() => {
        fetchAllPermissions();
    }, []);

    return (
        <div className="page-content" style={{ overflowX: 'clip' }}>
            <Container fluid style={{ overflowX: 'clip' }}>
                <Header
                    loading={loading}
                    onRefresh={fetchAllPermissions}
                    onCreatePermission={createPermission}
                />

                <AzFilterSummary
                    data={permissions}
                    columns={permissionTableColumns}
                    alwaysVisible={true}
                    showCount="always"
                    countPosition="top"
                >
                    {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
                        <Row>
                            <Col xl={12}>
                                <ContentTable
                                    filteredPermissions={filteredData}
                                    filters={filters}
                                    sorting={sorting}
                                    onFilterChange={onFilterChange}
                                    onSortChange={onSortChange}
                                    loading={loading}
                                />
                            </Col>
                        </Row>
                    )}
                </AzFilterSummary>
            </Container>
        </div>
    );
};

export default Permissions;
